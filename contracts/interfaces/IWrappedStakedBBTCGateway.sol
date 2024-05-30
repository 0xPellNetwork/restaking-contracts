// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';

interface IWrappedStakedBBTCGateway {
  /// @notice Emitted when a reward is added.
  /// @dev This event is emitted when a new reward is added to the contract.
  /// It includes the amount of the reward that was added.
  event RewardAdded(uint256 reward);
  /// @notice Emitted when a reward is paid to a user.
  /// @dev This event is emitted when a user's reward is paid out.
  /// It includes the address of the user and the amount of the reward that was paid.
  event RewardPaid(address indexed user, uint256 reward);
  /// @notice Emitted when operator address updated.
  event UpdateOperator(address previousOperator, address newOperator);
  /// @notice Emitted when rewards duration updated.
  event UpdateRewardsDuration(uint256 previousDuration, uint256 newDuration);
  /// @notice Emitted when strategy config.
  event SetStrategy(IStrategy previousStrategy, IStrategy newStrategy);

  /// @notice Error thrown when the provided reward is too high.
  /// @dev This error is thrown when the reward provided is too high and could cause an overflow.
  /// It ensures that the reward rate stays within the right range.
  error ProvidedRewardTooHigh();

  function depositStakedBBTC(uint256 amount) external;

  function withdrawStakedBBTC(
    IDelegationManager.Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexs,
    bool[] calldata receiveAsTokens
  ) external;
}
