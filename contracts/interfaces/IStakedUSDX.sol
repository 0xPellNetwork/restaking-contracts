// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IStakedUSDX {
  function deposit(uint256 assets, address receiver) external returns (uint256);
}
