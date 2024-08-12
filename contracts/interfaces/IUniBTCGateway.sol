// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IUniBTCGateway {
  function depositNativeToken() external payable;

  function depositERC20Token(address token, uint256 amount) external;
}
