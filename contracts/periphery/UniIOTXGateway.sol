// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IIOTXStaking} from '../interfaces/IIOTXStaking.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';
import {IStrategyManagerV2} from '../interfaces/IStrategyManagerV2.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';
import {IUniIOTXGateway} from '../interfaces/IUniIOTXGateway.sol';

contract UniIOTXGateway is IUniIOTXGateway, Ownable {
  using SafeERC20 for IERC20;

  IERC20 internal immutable uniIOTX;
  IIOTXStaking internal immutable iotxStaking;
  IStrategy internal immutable strategy;
  IStrategyManagerV2 internal immutable strategyManager;

  constructor(address _uniIOTX, address _iotxStaking, address _owner, IStrategy _strategy, IStrategyManagerV2 _strategyManager) {
    uniIOTX = IERC20(_uniIOTX);
    iotxStaking = IIOTXStaking(_iotxStaking);
    strategy = _strategy;
    strategyManager = _strategyManager;
    _transferOwnership(_owner);
    IERC20(_uniIOTX).approve(address(strategyManager), type(uint256).max);
  }

  function depositNativeToken(uint256 _deadline) external payable override {
    uint256 beforeBalance = uniIOTX.balanceOf(address(this));
    iotxStaking.deposit{value: msg.value}(_deadline);
    uint256 afterBalance = uniIOTX.balanceOf(address(this));
    uint256 amountToStake = afterBalance - beforeBalance;
    strategyManager.depositIntoStrategyWithStaker(msg.sender, strategy, IERC20(address(uniIOTX)), amountToStake);
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
   * @dev transfer native token from the utility contract, for native token recovery in case of stuck native
   * due to selfdestructs or Native transfers to the pre-computed contract address before deployment.
   * @param to recipient of the transfer
   * @param amount amount to send
   */
  function emergencyNativeTransfer(address to, uint256 amount) external onlyOwner {
    _safeTransferNative(to, amount);
  }

  /**
   * @dev transfer Native to an address, revert if it fails.
   * @param to recipient of the transfer
   * @param value the amount to send
   */
  function _safeTransferNative(address to, uint256 value) internal {
    (bool success, ) = to.call{value: value}(new bytes(0));
    require(success, 'NATIVE_TRANSFER_FAILED');
  }

  /**
   * @dev Get uniIOTX address used by UniIOTXGateway
   */
  function getUniIOTXAddress() external view returns (address) {
    return address(uniIOTX);
  }

  /**
   * @dev Get IOTXStaking address used by UniIOTXGateway
   */
  function getIOTXStakingAddress() external view returns (address) {
    return address(iotxStaking);
  }

  /**
   * @dev Get uniIOTX strategy address used by UniIOTXGateway
   */
  function getStrategyAddress() external view returns (address) {
    return address(strategy);
  }

  /**
   * @dev Only IOTXStaking contract is allowed to transfer native token here. Prevent other addresses to send native token to this contract.
   */
  receive() external payable {
    require(msg.sender == address(iotxStaking), 'Receive not allowed');
  }

  /**
   * @dev Revert fallback calls
   */
  fallback() external payable {
    revert('Fallback not allowed');
  }
}
