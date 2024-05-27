// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IDelegationManager} from '../interfaces/IDelegationManager.sol';

interface IWrappedStakedBBTCGateway {
  function depositStakedBBTC(uint256 amount) external;

  function withdrawStakedBBTC(
    IDelegationManager.Withdrawal[] calldata withdrawals,
    IERC20[][] calldata tokens,
    uint256[] calldata middlewareTimesIndexs,
    bool[] calldata receiveAsTokens
  ) external;
}
