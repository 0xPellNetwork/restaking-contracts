// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

interface IUniBTCVault {
  function mint() external payable;

  function mint(address _token, uint256 _amount) external;
}
