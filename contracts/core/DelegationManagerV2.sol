// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '../permissions/Pausable.sol';
import '../libraries/EIP1271SignatureUtils.sol';
import './DelegationManagerStorage.sol';

/**
 * @title DelegationManager
 * @notice  This is the contract for delegation in Pell. The main functionalities of this contract are
 * - enabling anyone to register as an operator in Pell
 * - allowing operators to specify parameters related to stakers who delegate to them
 * - enabling any staker to delegate its stake to the operator of its choice (a given staker can only delegate to a single operator at a time)
 * - enabling a staker to undelegate its assets from the operator it is delegated to (performed as part of the withdrawal process, initiated through the StrategyManager)
 */
contract DelegationManagerV2 is Initializable, OwnableUpgradeable, Pausable, DelegationManagerStorage, ReentrancyGuardUpgradeable {
  // @dev Index for flag that pauses new delegations when set
  uint8 internal constant PAUSED_NEW_DELEGATION = 0;

  // @dev Index for flag that pauses queuing new withdrawals when set.
  uint8 internal constant PAUSED_ENTER_WITHDRAWAL_QUEUE = 1;

  // @dev Index for flag that pauses completing existing withdrawals when set.
  uint8 internal constant PAUSED_EXIT_WITHDRAWAL_QUEUE = 2;

  // @dev Chain ID at the time of contract deployment
  uint256 internal immutable ORIGINAL_CHAIN_ID;

  // @dev Maximum Value for `stakerOptOutWindow`. Approximately equivalent to 6 months.
  uint256 public constant MAX_STAKER_OPT_OUT_WINDOW = 180 days;

  // @notice Simple permission for functions that are only callable by the StrategyManager contract
  modifier onlyStrategyManager() {
    require(msg.sender == address(strategyManager), 'DelegationManager: onlyStrategyManager');
    _;
  }

  /*******************************************************************************
                            INITIALIZING FUNCTIONS
    *******************************************************************************/

  /**
   * @dev Initializes the immutable addresses of the strategy mananger and slasher.
   */
  constructor(IStrategyManager _strategyManager, ISlasher _slasher) DelegationManagerStorage(_strategyManager, _slasher) {
    _disableInitializers();
    ORIGINAL_CHAIN_ID = block.chainid;
  }

  /**
   * @dev Initializes the addresses of the initial owner, pauser registry, and paused status.
   * minWithdrawalDelay is set only once here
   */
  function initialize(
    address initialOwner,
    IPauserRegistry _pauserRegistry,
    uint256 initialPausedStatus,
    uint256 _minWithdrawalDelay,
    IStrategy[] calldata _strategies,
    uint256[] calldata _withdrawalDelay
  ) external initializer {
    _initializePauser(_pauserRegistry, initialPausedStatus);
    _DOMAIN_SEPARATOR = _calculateDomainSeparator();
    _transferOwnership(initialOwner);
    _setMinWithdrawalDelay(_minWithdrawalDelay);
    _setStrategyWithdrawalDelay(_strategies, _withdrawalDelay);
  }

  /*******************************************************************************
                            EXTERNAL FUNCTIONS 
    *******************************************************************************/

  /**
   * @notice Registers the caller as an operator in Pell.
   * @param registeringOperatorDetails is the `OperatorDetails` for the operator.
   * @param metadataURI is a URI for the operator's metadata, i.e. a link providing more details on the operator.
   *
   * @dev Once an operator is registered, they cannot 'deregister' as an operator, and they will forever be considered "delegated to themself".
   * @dev This function will revert if the caller attempts to set their `earningsReceiver` to address(0).
   * @dev Note that the `metadataURI` is *never stored * and is only emitted in the `OperatorMetadataURIUpdated` event
   */
  function registerAsOperator(OperatorDetails calldata registeringOperatorDetails, string calldata metadataURI) external {
    require(
      _operatorDetails[msg.sender].earningsReceiver == address(0),
      'DelegationManager.registerAsOperator: operator has already registered'
    );
    _setOperatorDetails(msg.sender, registeringOperatorDetails);
    SignatureWithExpiry memory emptySignatureAndExpiry;
    // delegate from the operator to themselves
    _delegate(msg.sender, msg.sender, emptySignatureAndExpiry, bytes32(0));
    // emit events
    emit OperatorRegistered(msg.sender, registeringOperatorDetails);
    emit OperatorMetadataURIUpdated(msg.sender, metadataURI);
  }

  /**
   * @notice Updates an operator's stored `OperatorDetails`.
   * @param newOperatorDetails is the updated `OperatorDetails` for the operator, to replace their current OperatorDetails`.
   *
   * @dev The caller must have previously registered as an operator in Pell.
   * @dev This function will revert if the caller attempts to set their `earningsReceiver` to address(0).
   */
  function modifyOperatorDetails(OperatorDetails calldata newOperatorDetails) external {
    require(isOperator(msg.sender), 'DelegationManager.modifyOperatorDetails: caller must be an operator');
    _setOperatorDetails(msg.sender, newOperatorDetails);
  }

  /**
   * @notice Called by an operator to emit an `OperatorMetadataURIUpdated` event indicating the information has updated.
   * @param metadataURI The URI for metadata associated with an operator
   */
  function updateOperatorMetadataURI(string calldata metadataURI) external {
    require(isOperator(msg.sender), 'DelegationManager.updateOperatorMetadataURI: caller must be an operator');
    emit OperatorMetadataURIUpdated(msg.sender, metadataURI);
  }

  /**
   * @notice Caller delegates their stake to an operator.
   * @param operator The account (`msg.sender`) is delegating its assets to for use in serving applications built on Pell.
   * @param approverSignatureAndExpiry Verifies the operator approves of this delegation
   * @param approverSalt A unique single use value tied to an individual signature.
   * @dev The approverSignatureAndExpiry is used in the event that:
   *          1) the operator's `delegationApprover` address is set to a non-zero value.
   *                  AND
   *          2) neither the operator nor their `delegationApprover` is the `msg.sender`, since in the event that the operator
   *             or their delegationApprover is the `msg.sender`, then approval is assumed.
   * @dev In the event that `approverSignatureAndExpiry` is not checked, its content is ignored entirely; it's recommended to use an empty input
   * in this case to save on complexity + gas costs
   */
  function delegateTo(address operator, SignatureWithExpiry memory approverSignatureAndExpiry, bytes32 approverSalt) external {
    // go through the internal delegation flow, checking the `approverSignatureAndExpiry` if applicable
    _delegate(msg.sender, operator, approverSignatureAndExpiry, approverSalt);
  }

  /**
   * @notice Caller delegates a staker's stake to an operator with valid signatures from both parties.
   * @param staker The account delegating stake to an `operator` account
   * @param operator The account (`staker`) is delegating its assets to for use in serving applications built on Pell.
   * @param stakerSignatureAndExpiry Signed data from the staker authorizing delegating stake to an operator
   * @param approverSignatureAndExpiry is a parameter that will be used for verifying that the operator approves of this delegation action in the event that:
   * @param approverSalt Is a salt used to help guarantee signature uniqueness. Each salt can only be used once by a given approver.
   *
   * @dev If `staker` is an EOA, then `stakerSignature` is verified to be a valid ECDSA stakerSignature from `staker`, indicating their intention for this action.
   * @dev If `staker` is a contract, then `stakerSignature` will be checked according to EIP-1271.
   * @dev the operator's `delegationApprover` address is set to a non-zero value.
   * @dev neither the operator nor their `delegationApprover` is the `msg.sender`, since in the event that the operator or their delegationApprover
   * is the `msg.sender`, then approval is assumed.
   * @dev This function will revert if the current `block.timestamp` is equal to or exceeds the expiry
   * @dev In the case that `approverSignatureAndExpiry` is not checked, its content is ignored entirely; it's recommended to use an empty input
   * in this case to save on complexity + gas costs
   */
  function delegateToBySignature(
    address staker,
    address operator,
    SignatureWithExpiry memory stakerSignatureAndExpiry,
    SignatureWithExpiry memory approverSignatureAndExpiry,
    bytes32 approverSalt
  ) external {
    // check the signature expiry
    require(stakerSignatureAndExpiry.expiry >= block.timestamp, 'DelegationManager.delegateToBySignature: staker signature expired');

    // calculate the digest hash, then increment `staker`'s nonce
    uint256 currentStakerNonce = stakerNonce[staker];
    bytes32 stakerDigestHash = calculateStakerDelegationDigestHash(staker, currentStakerNonce, operator, stakerSignatureAndExpiry.expiry);
    unchecked {
      stakerNonce[staker] = currentStakerNonce + 1;
    }

    // actually check that the signature is valid
    EIP1271SignatureUtils.checkSignature_EIP1271(staker, stakerDigestHash, stakerSignatureAndExpiry.signature);

    // go through the internal delegation flow, checking the `approverSignatureAndExpiry` if applicable
    _delegate(staker, operator, approverSignatureAndExpiry, approverSalt);
  }

  /**
   * Allows the staker, the staker's operator, or that operator's delegationApprover to undelegate
   * a staker from their operator. Undelegation immediately removes ALL active shares/strategies from
   * both the staker and operator, and places the shares and strategies in the withdrawal queue
   */
  function undelegate(address staker) external onlyWhenNotPaused(PAUSED_ENTER_WITHDRAWAL_QUEUE) returns (bytes32[] memory withdrawalRoots) {
    require(isDelegated(staker), 'DelegationManager.undelegate: staker must be delegated to undelegate');
    require(!isOperator(staker), 'DelegationManager.undelegate: operators cannot be undelegated');
    require(staker != address(0), 'DelegationManager.undelegate: cannot undelegate zero address');
    address operator = delegatedTo[staker];
    require(
      msg.sender == staker || msg.sender == operator || msg.sender == _operatorDetails[operator].delegationApprover,
      'DelegationManager.undelegate: caller cannot undelegate staker'
    );

    // Gather strategies and shares to remove from staker/operator during undelegation
    // Undelegation removes ALL currently-active strategies and shares
    (IStrategy[] memory strategies, uint256[] memory shares) = getDelegatableShares(staker);

    // emit an event if this action was not initiated by the staker themselves
    if (msg.sender != staker) {
      emit StakerForceUndelegated(staker, operator);
    }

    // undelegate the staker
    emit StakerUndelegated(staker, operator);
    delegatedTo[staker] = address(0);

    // if no delegatable shares, return an empty array, and don't queue a withdrawal
    if (strategies.length == 0) {
      withdrawalRoots = new bytes32[](0);
    } else {
      withdrawalRoots = new bytes32[](strategies.length);
      for (uint256 i = 0; i < strategies.length; i++) {
        IStrategy[] memory singleStrategy = new IStrategy[](1);
        uint256[] memory singleShare = new uint256[](1);
        singleStrategy[0] = strategies[i];
        singleShare[0] = shares[i];

        withdrawalRoots[i] = _removeSharesAndQueueWithdrawal({
          staker: staker,
          operator: operator,
          withdrawer: staker,
          strategies: singleStrategy,
          shares: singleShare
        });
      }
    }

    return withdrawalRoots;
  }

  /**
   * Allows a staker to withdraw some shares. Withdrawn shares/strategies are immediately removed
   * from the staker. If the staker is delegated, withdrawn shares/strategies are also removed from
   * their operator.
   *
   * All withdrawn shares/strategies are placed in a queue and can be fully withdrawn after a delay.
   */
  function queueWithdrawals(
    QueuedWithdrawalParams[] calldata queuedWithdrawalParams
  ) external onlyWhenNotPaused(PAUSED_ENTER_WITHDRAWAL_QUEUE) returns (bytes32[] memory) {
    bytes32[] memory withdrawalRoots = new bytes32[](queuedWithdrawalParams.length);
    address operator = delegatedTo[msg.sender];

    for (uint256 i = 0; i < queuedWithdrawalParams.length; i++) {
      require(
        queuedWithdrawalParams[i].strategies.length == queuedWithdrawalParams[i].shares.length,
        'DelegationManager.queueWithdrawal: input length mismatch'
      );
      // require(queuedWithdrawalParams[i].withdrawer == msg.sender, 'DelegationManager.queueWithdrawal: withdrawer must be staker');

      // Remove shares from staker's strategies and place strategies/shares in queue.
      // If the staker is delegated to an operator, the operator's delegated shares are also reduced
      // NOTE: This will fail if the staker doesn't have the shares implied by the input parameters
      withdrawalRoots[i] = _removeSharesAndQueueWithdrawal({
        staker: msg.sender,
        operator: operator,
        withdrawer: queuedWithdrawalParams[i].withdrawer,
        strategies: queuedWithdrawalParams[i].strategies,
        shares: queuedWithdrawalParams[i].shares
      });
    }
    return withdrawalRoots;
  }

  /**
   * @notice Used to complete the specified `withdrawal`. The caller must match `withdrawal.withdrawer`
   * @param withdrawal The Withdrawal to complete.
   * @param tokens Array in which the i-th entry specifies the `token` input to the 'withdraw' function of the i-th Strategy in the `withdrawal.strategies` array.
   * This input can be provided with zero length if `receiveAsTokens` is set to 'false' (since in that case, this input will be unused)
   * @param middlewareTimesIndex is the index in the operator that the staker who triggered the withdrawal was delegated to's middleware times array
   * @param receiveAsTokens If true, the shares specified in the withdrawal will be withdrawn from the specified strategies themselves
   * and sent to the caller, through calls to `withdrawal.strategies[i].withdraw`. If false, then the shares in the specified strategies
   * will simply be transferred to the caller directly.
   * @dev middlewareTimesIndex is unused, but will be used in the Slasher eventually
   * @dev beaconChainETHStrategy shares are non-transferrable, so if `receiveAsTokens = false` and `withdrawal.withdrawer != withdrawal.staker`, note that
   * any beaconChainETHStrategy shares in the `withdrawal` will be _returned to the staker_, rather than transferred to the withdrawer, unlike shares in
   * any other strategies, which will be transferred to the withdrawer.
   */
  function completeQueuedWithdrawal(
    Withdrawal calldata withdrawal,
    IERC20[] calldata tokens,
    uint256 middlewareTimesIndex,
    bool receiveAsTokens
  ) external onlyWhenNotPaused(PAUSED_EXIT_WITHDRAWAL_QUEUE) nonReentrant {
    _completeQueuedWithdrawal(withdrawal, tokens, middlewareTimesIndex, receiveAsTokens);
  }

  /**
   * @notice Array-ified version of `completeQueuedWithdrawal`.
   * Used to complete the specified `withdrawals`. The function caller must match `withdrawals[...].withdrawer`
   * @param withdrawals The Withdrawals to complete.
   * @param tokens Array of tokens for each Withdrawal. See `completeQueuedWithdrawal` for the usage of a single array.
   * @param middlewareTimesIndexes One index to reference per Withdrawal. See `completeQueuedWithdrawal` for the usage of a single index.
   * @param receiveAsTokens Whether or not to complete each withdrawal as tokens. See `completeQueuedWithdrawal` for the usage of a single boolean.
   * @dev See `completeQueuedWithdrawal` for relevant dev tags
   */
  function completeQueuedWithdrawals(
    Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexes,
    bool[] calldata receiveAsTokens
  ) external onlyWhenNotPaused(PAUSED_EXIT_WITHDRAWAL_QUEUE) nonReentrant {
    for (uint256 i = 0; i < withdrawals.length; ++i) {
      _completeQueuedWithdrawal(withdrawals[i], tokens[i], middlewareTimesIndexes[i], receiveAsTokens[i]);
    }
  }

  /**
   * @notice Increases a staker's delegated share balance in a strategy.
   * @param staker The address to increase the delegated shares for their operator.
   * @param strategy The strategy in which to increase the delegated shares.
   * @param shares The number of shares to increase.
   *
   * @dev *If the staker is actively delegated*, then increases the `staker`'s delegated shares in `strategy` by `shares`. Otherwise does nothing.
   * @dev Callable only by the StrategyManager.
   */
  function increaseDelegatedShares(address staker, IStrategy strategy, uint256 shares) external onlyStrategyManager {
    // if the staker is delegated to an operator
    if (isDelegated(staker)) {
      address operator = delegatedTo[staker];

      // add strategy shares to delegate's shares
      _increaseOperatorShares({operator: operator, staker: staker, strategy: strategy, shares: shares});
    }
  }

  /**
   * @notice Decreases a staker's delegated share balance in a strategy.
   * @param staker The address to increase the delegated shares for their operator.
   * @param strategy The strategy in which to decrease the delegated shares.
   * @param shares The number of shares to decrease.
   *
   * @dev *If the staker is actively delegated*, then decreases the `staker`'s delegated shares in `strategy` by `shares`. Otherwise does nothing.
   * @dev Callable only by the StrategyManager or EigenPodManager.
   */
  function decreaseDelegatedShares(address staker, IStrategy strategy, uint256 shares) external onlyStrategyManager {
    // if the staker is delegated to an operator
    if (isDelegated(staker)) {
      address operator = delegatedTo[staker];

      // subtract strategy shares from delegate's shares
      _decreaseOperatorShares({operator: operator, staker: staker, strategy: strategy, shares: shares});
    }
  }

  /**
   * @notice Owner-only function for modifying the value of the `minWithdrawalDelay` variable.
   * @param newMinWithdrawalDelay new value of `minWithdrawalDelay`.
   */
  function setMinWithdrawalDelay(uint256 newMinWithdrawalDelay) external onlyOwner {
    _setMinWithdrawalDelay(newMinWithdrawalDelay);
  }

  /**
   * @notice Called by owner to set the minimum withdrawal delay for each passed in strategy
   * Note that the min cooldown to complete a withdrawal of a strategy is
   * MAX(minWithdrawalDelay, strategyWithdrawalDelay[strategy])
   * @param strategies The strategies to set the minimum withdrawal delay for
   * @param withdrawalDelay The minimum withdrawal delay to set for each strategy
   */
  function setStrategyWithdrawalDelay(IStrategy[] calldata strategies, uint256[] calldata withdrawalDelay) external onlyOwner {
    _setStrategyWithdrawalDelay(strategies, withdrawalDelay);
  }

  /*******************************************************************************
                            INTERNAL FUNCTIONS
    *******************************************************************************/

  /**
   * @notice Sets operator parameters in the `_operatorDetails` mapping.
   * @param operator The account registered as an operator updating their operatorDetails
   * @param newOperatorDetails The new parameters for the operator
   *
   * @dev This function will revert if the operator attempts to set their `earningsReceiver` to address(0).
   */
  function _setOperatorDetails(address operator, OperatorDetails calldata newOperatorDetails) internal {
    require(
      newOperatorDetails.earningsReceiver != address(0),
      'DelegationManager._setOperatorDetails: cannot set `earningsReceiver` to zero address'
    );
    require(
      newOperatorDetails.stakerOptOutWindow <= MAX_STAKER_OPT_OUT_WINDOW,
      'DelegationManager._setOperatorDetails: stakerOptOutWindow cannot be > MAX_STAKER_OPT_OUT_WINDOW'
    );
    require(
      newOperatorDetails.stakerOptOutWindow >= _operatorDetails[operator].stakerOptOutWindow,
      'DelegationManager._setOperatorDetails: stakerOptOutWindow cannot be decreased'
    );
    _operatorDetails[operator] = newOperatorDetails;
    emit OperatorDetailsModified(msg.sender, newOperatorDetails);
  }

  /**
   * @notice Delegates *from* a `staker` *to* an `operator`.
   * @param staker The address to delegate *from* -- this address is delegating control of its own assets.
   * @param operator The address to delegate *to* -- this address is being given power to place the `staker`'s assets at risk on services
   * @param approverSignatureAndExpiry Verifies the operator approves of this delegation
   * @param approverSalt Is a salt used to help guarantee signature uniqueness. Each salt can only be used once by a given approver.
   * @dev Ensures that:
   *          1) the `staker` is not already delegated to an operator
   *          2) the `operator` has indeed registered as an operator in Pell
   *          3) if applicable, that the approver signature is valid and non-expired
   */
  function _delegate(
    address staker,
    address operator,
    SignatureWithExpiry memory approverSignatureAndExpiry,
    bytes32 approverSalt
  ) internal onlyWhenNotPaused(PAUSED_NEW_DELEGATION) {
    require(!isDelegated(staker), 'DelegationManager._delegate: staker is already actively delegated');
    require(isOperator(operator), 'DelegationManager._delegate: operator is not registered in Pell');

    // fetch the operator's `delegationApprover` address and store it in memory in case we need to use it multiple times
    address _delegationApprover = _operatorDetails[operator].delegationApprover;
    /**
     * Check the `_delegationApprover`'s signature, if applicable.
     * If the `_delegationApprover` is the zero address, then the operator allows all stakers to delegate to them and this verification is skipped.
     * If the `_delegationApprover` or the `operator` themselves is the caller, then approval is assumed and signature verification is skipped as well.
     */
    if (_delegationApprover != address(0) && msg.sender != _delegationApprover && msg.sender != operator) {
      // check the signature expiry
      require(approverSignatureAndExpiry.expiry >= block.timestamp, 'DelegationManager._delegate: approver signature expired');
      // check that the salt hasn't been used previously, then mark the salt as spent
      require(!delegationApproverSaltIsSpent[_delegationApprover][approverSalt], 'DelegationManager._delegate: approverSalt already spent');
      delegationApproverSaltIsSpent[_delegationApprover][approverSalt] = true;

      // calculate the digest hash
      bytes32 approverDigestHash = calculateDelegationApprovalDigestHash(
        staker,
        operator,
        _delegationApprover,
        approverSalt,
        approverSignatureAndExpiry.expiry
      );

      // actually check that the signature is valid
      EIP1271SignatureUtils.checkSignature_EIP1271(_delegationApprover, approverDigestHash, approverSignatureAndExpiry.signature);
    }

    // record the delegation relation between the staker and operator, and emit an event
    delegatedTo[staker] = operator;
    emit StakerDelegated(staker, operator);

    (IStrategy[] memory strategies, uint256[] memory shares) = getDelegatableShares(staker);

    for (uint256 i = 0; i < strategies.length; ) {
      _increaseOperatorShares({operator: operator, staker: staker, strategy: strategies[i], shares: shares[i]});

      unchecked {
        ++i;
      }
    }
  }

  /**
   * @dev commented-out param (middlewareTimesIndex) is the index in the operator that the staker who triggered the withdrawal was delegated to's middleware times array
   * This param is intended to be passed on to the Slasher contract, but is unused in the M2 release of these contracts, and is thus commented-out.
   */
  function _completeQueuedWithdrawal(
    Withdrawal calldata withdrawal,
    IERC20[] calldata tokens,
    uint256 /*middlewareTimesIndex*/,
    bool receiveAsTokens
  ) internal {
    bytes32 withdrawalRoot = calculateWithdrawalRoot(withdrawal);

    require(pendingWithdrawals[withdrawalRoot], 'DelegationManager._completeQueuedWithdrawal: action is not in queue');

    require(
      withdrawal.startTimestamp + minWithdrawalDelay <= block.timestamp,
      'DelegationManager._completeQueuedWithdrawal: minWithdrawalDelay period has not yet passed'
    );

    require(msg.sender == withdrawal.withdrawer, 'DelegationManager._completeQueuedWithdrawal: only withdrawer can complete action');

    if (receiveAsTokens) {
      require(tokens.length == withdrawal.strategies.length, 'DelegationManager._completeQueuedWithdrawal: input length mismatch');
    }

    // Remove `withdrawalRoot` from pending roots
    delete pendingWithdrawals[withdrawalRoot];

    // Finalize action by converting shares to tokens for each strategy, or
    // by re-awarding shares in each strategy.
    if (receiveAsTokens) {
      for (uint256 i = 0; i < withdrawal.strategies.length; ) {
        require(
          withdrawal.startTimestamp + strategyWithdrawalDelay[withdrawal.strategies[i]] <= block.timestamp,
          'DelegationManager._completeQueuedWithdrawal: withdrawalDelay period has not yet passed for this strategy'
        );

        _withdrawSharesAsTokens({
          staker: withdrawal.staker,
          withdrawer: msg.sender,
          strategy: withdrawal.strategies[i],
          shares: withdrawal.shares[i],
          token: tokens[i]
        });
        unchecked {
          ++i;
        }
      }
      // Award shares back in StrategyManager/EigenPodManager. If withdrawer is delegated, increase the shares delegated to the operator
    } else {
      address currentOperator = delegatedTo[msg.sender];
      for (uint256 i = 0; i < withdrawal.strategies.length; ) {
        require(
          withdrawal.startTimestamp + strategyWithdrawalDelay[withdrawal.strategies[i]] <= block.timestamp,
          'DelegationManager._completeQueuedWithdrawal: withdrawalDelay period has not yet passed for this strategy'
        );

        strategyManager.addShares(msg.sender, tokens[i], withdrawal.strategies[i], withdrawal.shares[i]);
        // Similar to `isDelegated` logic
        if (currentOperator != address(0)) {
          _increaseOperatorShares({
            operator: currentOperator,
            // the 'staker' here is the address receiving new shares
            staker: msg.sender,
            strategy: withdrawal.strategies[i],
            shares: withdrawal.shares[i]
          });
        }

        unchecked {
          ++i;
        }
      }
    }

    emit WithdrawalCompleted(withdrawalRoot);
  }

  // @notice Increases `operator`s delegated shares in `strategy` by `shares` and emits an `OperatorSharesIncreased` event
  function _increaseOperatorShares(address operator, address staker, IStrategy strategy, uint256 shares) internal {
    operatorShares[operator][strategy] += shares;
    emit OperatorSharesIncreased(operator, staker, strategy, shares);
  }

  // @notice Decreases `operator`s delegated shares in `strategy` by `shares` and emits an `OperatorSharesDecreased` event
  function _decreaseOperatorShares(address operator, address staker, IStrategy strategy, uint256 shares) internal {
    // This will revert on underflow, so no check needed
    operatorShares[operator][strategy] -= shares;
    emit OperatorSharesDecreased(operator, staker, strategy, shares);
  }

  /**
   * @notice Removes `shares` in `strategies` from `staker` who is currently delegated to `operator` and queues a withdrawal to the `withdrawer`.
   * @dev If the `operator` is indeed an operator, then the operator's delegated shares in the `strategies` are also decreased appropriately.
   * @dev If `withdrawer` is not the same address as `staker`, then thirdPartyTransfersForbidden[strategy] must be set to false in the StrategyManager.
   */
  function _removeSharesAndQueueWithdrawal(
    address staker,
    address operator,
    address withdrawer,
    IStrategy[] memory strategies,
    uint256[] memory shares
  ) internal returns (bytes32) {
    require(staker != address(0), 'DelegationManager._removeSharesAndQueueWithdrawal: staker cannot be zero address');
    require(strategies.length != 0, 'DelegationManager._removeSharesAndQueueWithdrawal: strategies cannot be empty');

    // Remove shares from staker and operator
    // Each of these operations fail if we attempt to remove more shares than exist
    for (uint256 i = 0; i < strategies.length; ) {
      // Similar to `isDelegated` logic
      if (operator != address(0)) {
        _decreaseOperatorShares({operator: operator, staker: staker, strategy: strategies[i], shares: shares[i]});
      }

      require(
        staker == withdrawer || !strategyManager.thirdPartyTransfersForbidden(strategies[i]),
        'DelegationManager._removeSharesAndQueueWithdrawal: withdrawer must be same address as staker if thirdPartyTransfersForbidden are set'
      );
      // this call will revert if `shares[i]` exceeds the Staker's current shares in `strategies[i]`
      strategyManager.removeShares(staker, strategies[i], shares[i]);

      unchecked {
        ++i;
      }
    }

    // Create queue entry and increment withdrawal nonce
    uint256 nonce = cumulativeWithdrawalsQueued[staker];
    cumulativeWithdrawalsQueued[staker]++;

    Withdrawal memory withdrawal = Withdrawal({
      staker: staker,
      delegatedTo: operator,
      withdrawer: withdrawer,
      nonce: nonce,
      startTimestamp: uint32(block.timestamp),
      strategies: strategies,
      shares: shares
    });

    bytes32 withdrawalRoot = calculateWithdrawalRoot(withdrawal);

    // Place withdrawal in queue
    pendingWithdrawals[withdrawalRoot] = true;

    emit WithdrawalQueued(withdrawalRoot, withdrawal);
    return withdrawalRoot;
  }

  /**
   * @notice Withdraws `shares` in `strategy` to `withdrawer`. Call is ultimately forwarded to the `strategy` with info on the `token`.
   */
  function _withdrawSharesAsTokens(address staker, address withdrawer, IStrategy strategy, uint256 shares, IERC20 token) internal {
    strategyManager.withdrawSharesAsTokens(withdrawer, strategy, shares, token);
  }

  function _setMinWithdrawalDelay(uint256 _minWithdrawalDelay) internal {
    require(
      _minWithdrawalDelay <= MAX_WITHDRAWAL_DELAY,
      'DelegationManager._setMinWithdrawalDelay: _minWithdrawalDelay cannot be > MAX_WITHDRAWAL_DELAY'
    );
    emit MinWithdrawalDelaySet(minWithdrawalDelay, _minWithdrawalDelay);
    minWithdrawalDelay = _minWithdrawalDelay;
  }

  /**
   * @notice Sets the withdrawal delay for each strategy in `_strategies` to `_withdrawalDelay`.
   * gets called when initializing contract or by calling `setStrategyWithdrawalDelay`
   */
  function _setStrategyWithdrawalDelay(IStrategy[] calldata _strategies, uint256[] calldata _withdrawalDelay) internal {
    require(_strategies.length == _withdrawalDelay.length, 'DelegationManager._setStrategyWithdrawalDelay: input length mismatch');
    uint256 numStrats = _strategies.length;
    for (uint256 i = 0; i < numStrats; ++i) {
      IStrategy strategy = _strategies[i];
      uint256 prevStrategyWithdrawalDelay = strategyWithdrawalDelay[strategy];
      uint256 newStrategyWithdrawalDelay = _withdrawalDelay[i];
      require(
        newStrategyWithdrawalDelay <= MAX_WITHDRAWAL_DELAY,
        'DelegationManager._setStrategyWithdrawalDelay: _withdrawalDelay cannot be > MAX_WITHDRAWAL_DELAY'
      );

      // set the new withdrawal delay
      strategyWithdrawalDelay[strategy] = newStrategyWithdrawalDelay;
      emit StrategyWithdrawalDelaySet(strategy, prevStrategyWithdrawalDelay, newStrategyWithdrawalDelay);
    }
  }

  /*******************************************************************************
                            VIEW FUNCTIONS
    *******************************************************************************/

  /**
   * @notice Getter function for the current EIP-712 domain separator for this contract.
   *
   * @dev The domain separator will change in the event of a fork that changes the ChainID.
   * @dev By introducing a domain separator the DApp developers are guaranteed that there can be no signature collision.
   * for more detailed information please read EIP-712.
   */
  function domainSeparator() public view returns (bytes32) {
    if (block.chainid == ORIGINAL_CHAIN_ID) {
      return _DOMAIN_SEPARATOR;
    } else {
      return _calculateDomainSeparator();
    }
  }

  /**
   * @notice Returns 'true' if `staker` *is* actively delegated, and 'false' otherwise.
   */
  function isDelegated(address staker) public view returns (bool) {
    return (delegatedTo[staker] != address(0));
  }

  /**
   * @notice Returns true is an operator has previously registered for delegation.
   */
  function isOperator(address operator) public view returns (bool) {
    return (_operatorDetails[operator].earningsReceiver != address(0));
  }

  /**
   * @notice Returns the OperatorDetails struct associated with an `operator`.
   */
  function operatorDetails(address operator) external view returns (OperatorDetails memory) {
    return _operatorDetails[operator];
  }

  /*
   * @notice Returns the earnings receiver address for an operator
   */
  function earningsReceiver(address operator) external view returns (address) {
    return _operatorDetails[operator].earningsReceiver;
  }

  /**
   * @notice Returns the delegationApprover account for an operator
   */
  function delegationApprover(address operator) external view returns (address) {
    return _operatorDetails[operator].delegationApprover;
  }

  /**
   * @notice Returns the stakerOptOutWindow for an operator
   */
  function stakerOptOutWindow(address operator) external view returns (uint256) {
    return _operatorDetails[operator].stakerOptOutWindow;
  }

  /// @notice Given array of strategies, returns array of shares for the operator
  function getOperatorShares(address operator, IStrategy[] memory strategies) public view returns (uint256[] memory) {
    uint256[] memory shares = new uint256[](strategies.length);
    for (uint256 i = 0; i < strategies.length; ++i) {
      shares[i] = operatorShares[operator][strategies[i]];
    }
    return shares;
  }

  /**
   * @notice Returns the number of actively-delegatable shares a staker has across all strategies.
   * @dev Returns two empty arrays in the case that the Staker has no actively-delegateable shares.
   */
  function getDelegatableShares(address staker) public view returns (IStrategy[] memory, uint256[] memory) {
    // Get currently active shares and strategies for `staker`
    (IStrategy[] memory strategyManagerStrats, uint256[] memory strategyManagerShares) = strategyManager.getDeposits(staker);
    return (strategyManagerStrats, strategyManagerShares);
  }

  /**
   * @notice Given a list of strategies, return the minimum cooldown that must pass to withdraw
   * from all the inputted strategies. Return value is >= minWithdrawalDelay as this is the global min withdrawal delay.
   * @param strategies The strategies to check withdrawal delays for
   */
  function getWithdrawalDelay(IStrategy[] calldata strategies) public view returns (uint256) {
    uint256 withdrawalDelay = minWithdrawalDelay;
    for (uint256 i = 0; i < strategies.length; ++i) {
      uint256 currWithdrawalDelay = strategyWithdrawalDelay[strategies[i]];
      if (currWithdrawalDelay > withdrawalDelay) {
        withdrawalDelay = currWithdrawalDelay;
      }
    }
    return withdrawalDelay;
  }

  /// @notice Returns the keccak256 hash of `withdrawal`.
  function calculateWithdrawalRoot(Withdrawal memory withdrawal) public pure returns (bytes32) {
    return keccak256(abi.encode(withdrawal));
  }

  /**
   * @notice Calculates the digestHash for a `staker` to sign to delegate to an `operator`
   * @param staker The signing staker
   * @param operator The operator who is being delegated to
   * @param expiry The desired expiry time of the staker's signature
   */
  function calculateCurrentStakerDelegationDigestHash(address staker, address operator, uint256 expiry) external view returns (bytes32) {
    // fetch the staker's current nonce
    uint256 currentStakerNonce = stakerNonce[staker];
    // calculate the digest hash
    return calculateStakerDelegationDigestHash(staker, currentStakerNonce, operator, expiry);
  }

  /**
   * @notice Calculates the digest hash to be signed and used in the `delegateToBySignature` function
   * @param staker The signing staker
   * @param _stakerNonce The nonce of the staker. In practice we use the staker's current nonce, stored at `stakerNonce[staker]`
   * @param operator The operator who is being delegated to
   * @param expiry The desired expiry time of the staker's signature
   */
  function calculateStakerDelegationDigestHash(
    address staker,
    uint256 _stakerNonce,
    address operator,
    uint256 expiry
  ) public view returns (bytes32) {
    // calculate the struct hash
    bytes32 stakerStructHash = keccak256(abi.encode(STAKER_DELEGATION_TYPEHASH, staker, operator, _stakerNonce, expiry));
    // calculate the digest hash
    bytes32 stakerDigestHash = keccak256(abi.encodePacked('\x19\x01', domainSeparator(), stakerStructHash));
    return stakerDigestHash;
  }

  /**
   * @notice Calculates the digest hash to be signed by the operator's delegationApprove and used in the `delegateTo` and `delegateToBySignature` functions.
   * @param staker The account delegating their stake
   * @param operator The account receiving delegated stake
   * @param _delegationApprover the operator's `delegationApprover` who will be signing the delegationHash (in general)
   * @param approverSalt A unique and single use value associated with the approver signature.
   * @param expiry Time after which the approver's signature becomes invalid
   */
  function calculateDelegationApprovalDigestHash(
    address staker,
    address operator,
    address _delegationApprover,
    bytes32 approverSalt,
    uint256 expiry
  ) public view returns (bytes32) {
    // calculate the struct hash
    bytes32 approverStructHash = keccak256(
      abi.encode(DELEGATION_APPROVAL_TYPEHASH, _delegationApprover, staker, operator, approverSalt, expiry)
    );
    // calculate the digest hash
    bytes32 approverDigestHash = keccak256(abi.encodePacked('\x19\x01', domainSeparator(), approverStructHash));
    return approverDigestHash;
  }

  /**
   * @dev Recalculates the domain separator when the chainid changes due to a fork.
   */
  function _calculateDomainSeparator() internal view returns (bytes32) {
    return keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes('Pell')), block.chainid, address(this)));
  }
}
