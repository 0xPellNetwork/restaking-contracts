// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IUniIOTXGateway {
  function depositNativeToken(uint256 _deadline) external payable;
}
