// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {ERC20Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {AccessControlUpgradeable} from '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import {Initializable} from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {Address} from '@openzeppelin/contracts/utils/Address.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IStakedBBTC} from '../interfaces/IStakedBBTC.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';
import {IStrategyManagerV2} from '../interfaces/IStrategyManagerV2.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';
import {IWrappedStakedBBTCGateway} from '../interfaces/IWrappedStakedBBTCGateway.sol';

contract WrappedStakedBBTCGateway is
  Initializable,
  ERC20Upgradeable,
  OwnableUpgradeable,
  AccessControlUpgradeable,
  ReentrancyGuardUpgradeable,
  IWrappedStakedBBTCGateway
{
  using SafeERC20 for IERC20;

  bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

  IStakedBBTC internal immutable stBBTC;
  IStrategyManagerV2 internal immutable strategyManager;
  IDelegationManager internal immutable delegationManager;
  IStrategy internal strategy;
  mapping(address => uint256) internal _balancesOfStBBTC;

  /// @notice The time when the reward period finishes.
  /// @dev This is the timestamp when the reward period will end.
  /// Rewards are only applicable within the period specified by this variable.
  uint256 public periodFinish;
  /// @notice The rate of the reward.
  /// @dev This is the rate at which rewards are distributed.
  /// It is calculated based on the total reward and the duration of the reward period.
  uint256 public rewardRate;
  /// @notice The duration of the reward period.
  /// @dev This is the duration for which the rewards are applicable.
  /// The rewards are distributed over this period at the rate specified by rewardRate.
  uint256 public rewardsDuration;
  /// @notice The last time the rewards were updated.
  /// @dev This is the timestamp of the last time the rewards were updated.
  /// It is used to calculate the reward per token and the earned rewards.
  uint256 public lastUpdateTime;
  /// @notice The stored reward per token.
  /// @dev This is the stored value of the reward per token.
  /// It is used to calculate the reward per token and the earned rewards.
  uint256 public rewardPerTokenStored;
  /// @notice The reward per token paid to each user.
  /// @dev This mapping stores the reward per token paid to each user.
  /// It is used to calculate the earned rewards for each user.
  mapping(address => uint256) public userRewardPerTokenPaid;
  /// @notice The rewards for each user.
  /// @dev This mapping stores the rewards for each user.
  /// It is updated whenever a user stakes or withdraws tokens, or gets their reward.
  mapping(address => uint256) public rewards;

  /// @notice Modifier to update the reward for a given account.
  /// @dev This modifier calls the _updateReward function with the provided account as argument.
  /// It is used before functions that need to update the reward for a user.
  modifier updateReward(address account) {
    _updateReward(account);
    _;
  }

  constructor(IStakedBBTC _stBBTC, IStrategyManagerV2 _strategyManager, IDelegationManager _delegationManager) {
    stBBTC = _stBBTC;
    strategyManager = _strategyManager;
    delegationManager = _delegationManager;
    _disableInitializers();
  }

  function initialize(address _owner, uint256 _rewardsDuration) external initializer {
    rewardsDuration = _rewardsDuration;
    __ERC20_init('Wrapped Staked BBTC', 'wstBBTC');
    __ReentrancyGuard_init();
    _transferOwnership(_owner);
    _approve(address(this), address(strategyManager), type(uint256).max);
  }

  function depositStakedBBTC(uint256 amount) external virtual override nonReentrant updateReward(msg.sender) {
    IERC20(address(stBBTC)).safeTransferFrom(msg.sender, address(this), amount);
    _mint(address(this), amount);
    _balancesOfStBBTC[msg.sender] += amount;
    strategyManager.depositIntoStrategyWithStaker(msg.sender, strategy, IERC20(address(this)), amount);
  }

  function withdrawStakedBBTC(
    IDelegationManager.Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexs,
    bool[] calldata receiveAsTokens
  ) external virtual override nonReentrant updateReward(msg.sender) {
    for (uint256 i = 0; i < withdrawals.length; i++) {
      require(withdrawals[i].staker == msg.sender, 'Withdrawer must be staker');
      for (uint256 j = 0; j < withdrawals[i].strategies.length; j++) {
        require(withdrawals[i].strategies[j] == strategy, 'Only support stBBTC token strategy');
      }
    }
    uint256 beforeBalance = balanceOf(address(this));
    delegationManager.completeQueuedWithdrawals(withdrawals, tokens, middlewareTimesIndexs, receiveAsTokens);
    uint256 afterBalance = balanceOf(address(this));
    uint256 amountToWithdraw = afterBalance - beforeBalance;
    _burn(address(this), amountToWithdraw);
    _balancesOfStBBTC[msg.sender] -= amountToWithdraw;
    IERC20(address(stBBTC)).safeTransfer(msg.sender, amountToWithdraw);
  }

  /// @notice Allows a user to get their reward.
  /// @dev It updates the reward for the user before transferring.
  function getReward() public nonReentrant updateReward(msg.sender) {
    uint256 reward = rewards[msg.sender];
    if (reward > 0) {
      rewards[msg.sender] = 0;
      Address.sendValue(payable(msg.sender), reward);
      emit RewardPaid(msg.sender, reward);
    }
  }

  /// @notice Notifies the contract about the reward amount.
  /// @dev It updates the reward rate and the finish period of the reward.
  function notifyRewardAmount() external payable onlyRole(OPERATOR_ROLE) updateReward(address(0)) {
    uint256 beforeBalance = address(this).balance;
    stBBTC.getReward();
    uint256 afterBalance = address(this).balance;
    uint256 reward = afterBalance - beforeBalance;
    if (msg.value != 0) {
      reward += msg.value;
    }

    if (block.timestamp >= periodFinish) {
      rewardRate = reward / rewardsDuration;
    } else {
      uint256 remaining = periodFinish - block.timestamp;
      uint256 leftover = remaining * rewardRate;
      rewardRate = (reward + leftover) / rewardsDuration;
    }

    // Ensure the provided reward amount is not more than the balance in the contract.
    // This keeps the reward rate in the right range, preventing overflows due to
    // very high values of rewardRate in the earned and rewardsPerToken functions;
    // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
    if (rewardRate > afterBalance / rewardsDuration) {
      revert ProvidedRewardTooHigh();
    }

    lastUpdateTime = block.timestamp;
    periodFinish = block.timestamp + rewardsDuration;
    emit RewardAdded(reward);
  }

  /// @notice Determines the last time the reward is applicable.
  /// @dev This function checks if the current block timestamp is less than the period finish time.
  /// If it is, it returns the block timestamp, otherwise it returns the period finish time.
  /// This is used to ensure that rewards are only applicable within the specified period.
  /// @return The last time the reward is applicable.
  function lastTimeRewardApplicable() public view returns (uint256) {
    return block.timestamp < periodFinish ? block.timestamp : periodFinish;
  }

  /// @notice Calculates the reward per token.
  /// @dev This function calculates the reward per token based on the total supply of tokens.
  /// This is used to distribute the rewards proportionally to the token holders.
  /// @return The calculated reward per token.
  function rewardPerToken() public view returns (uint256) {
    if (totalSupply() == 0) {
      return rewardPerTokenStored;
    }
    return rewardPerTokenStored + (((lastTimeRewardApplicable() - lastUpdateTime) * (rewardRate) * (1e18)) / (totalSupply()));
  }

  /// @notice Calculates the earned rewards for a given account.
  /// @dev This function calculates the earned rewards by multiplying the balance of the account
  /// with the difference between the reward per token and the reward per token paid to the account.
  /// @param account The account to calculate the earned rewards for.
  /// @return The calculated earned rewards for the account.
  function earned(address account) public view returns (uint256) {
    return (_balancesOfStBBTC[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + rewards[account];
  }

  /// @notice Calculates the reward for the entire duration.
  /// @dev This is used to get the total reward that will be distributed over the entire duration.
  /// @return The total reward for the duration.
  function getRewardForDuration() external view returns (uint256) {
    return rewardRate * rewardsDuration;
  }

  function isOperator(address _operator) external view returns (bool) {
    return hasRole(OPERATOR_ROLE, _operator);
  }

  function addOperator(address _operator) external onlyOwner {
    require(_operator != address(0), 'Zero address not valid');
    _grantRole(OPERATOR_ROLE, _operator);
  }

  function removeOperator(address _operator) external onlyOwner {
    require(_operator != address(0), 'Zero address not valid');
    _revokeRole(OPERATOR_ROLE, _operator);
  }

  function updateRewardsDuration(uint256 _duration) external onlyOwner {
    require(block.timestamp > periodFinish, 'Previous rewards period must be complete before changing the duration for the new period');
    emit UpdateRewardsDuration(rewardsDuration, _duration);
    rewardsDuration = _duration;
  }

  /**
   * @dev transfer ERC20 from the utility contract, for ERC20 recovery in case of stuck tokens due
   * direct transfers to the contract address.
   * @param token token to transfer
   * @param to recipient of the transfer
   * @param amount amount to send
   */
  function emergencyTokenTransfer(address token, address to, uint256 amount) external onlyOwner {
    require(token != address(stBBTC), 'The underlying asset cannot be rescued');
    IERC20(token).safeTransfer(to, amount);
  }

  function setStrategy(IStrategy _strategy) external onlyOwner {
    emit SetStrategy(strategy, _strategy);
    strategy = _strategy;
  }

  /**
   * @dev Get stBBTC address used by WrappedStakedBBTCGateway
   */
  function getStakedBBTCAddress() external view returns (address) {
    return address(stBBTC);
  }

  /**
   * @dev Get stBBTC strategy address used by WrappedStakedBBTCGateway
   */
  function getStrategyAddress() external view returns (address) {
    return address(strategy);
  }

  /// @notice Updates the reward for a given account.
  /// @dev This function updates the stored reward per token and the last update time.
  /// If the account is not the zero address, it also updates the rewards and the reward per token
  /// paid for the account.
  /// @param account The account to update the reward for.
  function _updateReward(address account) internal {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = lastTimeRewardApplicable();
    if (account != address(0)) {
      rewards[account] = earned(account);
      userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }
  }

  /**
   * @dev Only WrappedStakedBBTC contract is allowed to transfer native token here.
   */
  receive() external payable {}

  /**
   * @dev Revert fallback calls with data
   */
  fallback() external payable {
    require(msg.data.length == 0, 'NON_EMPTY_DATA');
  }

  /**
   * @dev This empty reserved space is put in place to allow future versions to add new
   * variables without shifting down storage in the inheritance chain.
   * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
   */
  uint256[49] private __gap;
}
