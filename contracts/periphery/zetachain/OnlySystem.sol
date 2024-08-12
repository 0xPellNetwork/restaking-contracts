// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import './SystemContract.sol';

contract OnlySystem {
  error OnlySystemContract(string);

  modifier onlySystem(SystemContract systemContract) {
    if (msg.sender != address(systemContract)) {
      revert OnlySystemContract('Only system contract can call this function');
    }
    _;
  }
}
