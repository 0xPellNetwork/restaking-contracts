// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

interface IStakedBBTC {
  function lockOfInLocker(address account, address locker) external view returns (uint256);

  function lockOf(address account) external view returns (uint256);

  function lock(address account, uint256 amount) external;

  function unlock(address account, uint256 amount) external;

  function approve(address guy, uint256 wad) external returns (bool);
}
