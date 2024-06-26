// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import './IStrategy.sol';
import './ISlasher.sol';
import './IDelegationManager.sol';

/**
 * @title Interface for the primary entrypoint for funds into Pell.
 * @notice See the `StrategyManager` contract itself for implementation details.
 */
interface IStrategyManagerV2 {
  /**
   * @notice Deposits `amount` of `token` into the specified `strategy`, with the resultant shares credited to `msg.sender`
   * @param staker Staker address
   * @param strategy is the specified strategy where deposit is to be made,
   * @param token is the denomination in which the deposit is to be made,
   * @param amount is the amount of token to be deposited in the strategy by the staker
   * @return shares The amount of new shares in the `strategy` created as part of the action.
   * @dev The `msg.sender` must have previously approved this contract to transfer at least `amount` of `token` on their behalf.
   * @dev Cannot be called by an address that is 'frozen' (this function will revert if the `msg.sender` is frozen).
   *
   * WARNING: Depositing tokens that allow reentrancy (eg. ERC-777) into a strategy is not recommended.  This can lead to attack vectors
   *          where the token balance and corresponding strategy shares are not in sync upon reentrancy.
   */
  function depositIntoStrategyWithStaker(
    address staker,
    IStrategy strategy,
    IERC20 token,
    uint256 amount
  ) external returns (uint256 shares);
}
