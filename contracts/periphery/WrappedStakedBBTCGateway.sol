// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ERC20, IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IStakedBBTC} from '../interfaces/IStakedBBTC.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';
import {IStrategyManagerV2} from '../interfaces/IStrategyManagerV2.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';
import {IWrappedStakedBBTCGateway} from '../interfaces/IWrappedStakedBBTCGateway.sol';

contract WrappedStakedBBTCGateway is ERC20, IWrappedStakedBBTCGateway, Ownable {
  using SafeERC20 for IERC20;

  IStakedBBTC internal immutable stBBTC;
  IStrategyManagerV2 internal immutable strategyManager;
  IDelegationManager internal immutable delegationManager;
  IStrategy internal strategy;

  event SetStrategy(IStrategy previousStrategy, IStrategy newStrategy);

  constructor(
    address _stBBTC,
    address _owner,
    IStrategyManagerV2 _strategyManager,
    IDelegationManager _delegationManager
  ) ERC20('Wrapped Staked BBTC', 'wstBBTC') {
    stBBTC = IStakedBBTC(_stBBTC);
    strategyManager = _strategyManager;
    delegationManager = _delegationManager;
    transferOwnership(_owner);
    approve(address(strategyManager), type(uint256).max);
  }

  function depositStakedBBTC(uint256 amount) external {
    stBBTC.lock(msg.sender, amount);
    _mint(address(this), amount);
    strategyManager.depositIntoStrategyWithStaker(msg.sender, strategy, IERC20(address(this)), amount);
  }

  function withdrawStakedBBTC(
    IDelegationManager.Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexs,
    bool[] calldata receiveAsTokens
  ) external {
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
    stBBTC.unlock(msg.sender, amountToWithdraw);
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
}
