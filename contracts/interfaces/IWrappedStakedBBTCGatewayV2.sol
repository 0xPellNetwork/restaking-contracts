// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {IWrappedStakedBBTCGateway} from './IWrappedStakedBBTCGateway.sol';

interface IWrappedStakedBBTCGatewayV2 is IWrappedStakedBBTCGateway {
  /// @notice Emitted when LenB pool config.
  event UpdateLenBPool(address previousPool, address currentPool);

  function depositStakedBBTCToLenB(uint256 amount, address onBehalfOf, uint16 referralCode) external;

  function withdrawStakedBBTCFromLenB(uint256 amount) external;
}
