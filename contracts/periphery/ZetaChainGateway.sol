// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';
import {IStrategyManagerV2} from '../interfaces/IStrategyManagerV2.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';
import {SystemContract, IZRC20} from './zetachain/SystemContract.sol';
import {zContract, zContext} from './zetachain/zContract.sol';
import {OnlySystem} from './zetachain/OnlySystem.sol';
import {BytesHelperLib} from './zetachain/BytesHelperLib.sol';

contract ZetaChainGateway is Ownable, zContract, OnlySystem {
  using SafeERC20 for IERC20;

  SystemContract public immutable zetachainSystemContract;
  IZRC20 internal immutable bitcoinZRC20;
  IStrategy internal immutable strategy;
  IStrategyManagerV2 internal immutable strategyManager;
  IDelegationManager internal immutable delegationManager;

  constructor(
    address _zetachainSystemContract,
    address _zrc20,
    address _owner,
    IStrategy _strategy,
    IStrategyManagerV2 _strategyManager,
    IDelegationManager _delegationManager
  ) {
    zetachainSystemContract = SystemContract(_zetachainSystemContract);
    bitcoinZRC20 = IZRC20(_zrc20);
    strategy = _strategy;
    strategyManager = _strategyManager;
    delegationManager = _delegationManager;
    _transferOwnership(_owner);
    IZRC20(_zrc20).approve(address(strategyManager), type(uint256).max);
  }

  function onCrossChainCall(
    zContext calldata context,
    address zrc20,
    uint256 amount,
    bytes calldata message
  ) external virtual override onlySystem(zetachainSystemContract) {
    require(zrc20 == address(bitcoinZRC20), 'Only support bitcoin zrc20');
    address staker = BytesHelperLib.bytesToAddress(message, 0);
    require(staker != address(0), 'Invalid staker address');
    strategyManager.depositIntoStrategyWithStaker(staker, strategy, IERC20(address(bitcoinZRC20)), amount);
  }

  function withdrawNativeTokens(
    IDelegationManager.Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexs,
    bool[] calldata receiveAsTokens,
    bytes calldata bitcoinRecipient
  ) external {
    for (uint256 i = 0; i < withdrawals.length; i++) {
      require(withdrawals[i].staker == msg.sender, 'Withdrawer must be staker');
      for (uint256 j = 0; j < withdrawals[i].strategies.length; j++) {
        require(withdrawals[i].strategies[j] == strategy, 'Only support wrapped token strategy');
      }
    }
    uint256 beforeBalance = bitcoinZRC20.balanceOf(address(this));
    delegationManager.completeQueuedWithdrawals(withdrawals, tokens, middlewareTimesIndexs, receiveAsTokens);
    uint256 afterBalance = bitcoinZRC20.balanceOf(address(this));
    uint256 amountToWithdraw = afterBalance - beforeBalance;

    (, uint256 gasFee) = IZRC20(bitcoinZRC20).withdrawGasFee();

    require(gasFee >= amountToWithdraw, 'Insufficient withdraw gas fee');

    IZRC20(bitcoinZRC20).approve(address(bitcoinZRC20), gasFee);
    IZRC20(bitcoinZRC20).withdraw(bitcoinRecipient, amountToWithdraw - gasFee);
  }

  /**
   * @dev transfer ERC20 from the utility contract, for ERC20 recovery in case of stuck tokens due
   * direct transfers to the contract address.
   * @param token token to transfer
   * @param to recipient of the transfer
   * @param amount amount to send
   */
  function emergencyTokenTransfer(address token, address to, uint256 amount) external onlyOwner {
    IERC20(token).safeTransfer(to, amount);
  }

  /**
   * @dev Get BitcoinZRC20Token address used by ZetaChainGateway
   */
  function getBitcoinZRC20Address() external view returns (address) {
    return address(bitcoinZRC20);
  }

  /**
   * @dev Get Bitcoin ZRC20 Token strategy address used by ZetaChainGateway
   */
  function getStrategyAddress() external view returns (address) {
    return address(strategy);
  }
}
