// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IStakedBBTC {
  function lockOfInLocker(address account, address locker) external view returns (uint256);

  function lockOf(address account) external view returns (uint256);

  function lock(address account, uint256 amount) external;

  function unlock(address account, uint256 amount) external;

  function approve(address guy, uint256 wad) external returns (bool);

  function transfer(address to, uint256 amount) external returns (bool);

  function transferFrom(address from, address to, uint256 amount) external returns (bool);

  function getReward() external;
}
