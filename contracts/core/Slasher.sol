// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import '../interfaces/ISlasher.sol';
import '../interfaces/IDelegationManager.sol';
import '../interfaces/IStrategyManager.sol';
import '../libraries/StructuredLinkedList.sol';
import '../permissions/Pausable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @notice This contract is not in use as of the Pell release.
 */
contract Slasher is Initializable, OwnableUpgradeable, ISlasher, Pausable {
  constructor(IStrategyManager, IDelegationManager) {}

  function initialize(address, IPauserRegistry, uint256) external {}

  function optIntoSlashing(address) external {}

  function freezeOperator(address) external {}

  function resetFrozenStatus(address[] calldata) external {}

  function recordFirstStakeUpdate(address, uint32) external {}

  function recordStakeUpdate(address, uint32, uint32, uint256) external {}

  function recordLastStakeUpdateAndRevokeSlashingAbility(address, uint32) external {}

  function strategyManager() external view returns (IStrategyManager) {}

  function delegation() external view returns (IDelegationManager) {}

  function isFrozen(address) external view returns (bool) {}

  function canSlash(address, address) external view returns (bool) {}

  function contractCanSlashOperatorUntilTimestamp(address, address) external view returns (uint32) {}

  function latestUpdateTimestamp(address, address) external view returns (uint32) {}

  function getCorrectValueForInsertAfter(address, uint32) external view returns (uint256) {}

  function canWithdraw(address, uint32, uint256) external returns (bool) {}

  function operatorToMiddlewareTimes(address, uint256) external view returns (MiddlewareTimes memory) {}

  function middlewareTimesLength(address) external view returns (uint256) {}

  function getMiddlewareTimesIndexStalestUpdateTimestamp(address, uint32) external view returns (uint32) {}

  function getMiddlewareTimesIndexServeUntilTimestamp(address, uint32) external view returns (uint32) {}

  function operatorWhitelistedContractsLinkedListSize(address) external view returns (uint256) {}

  function operatorWhitelistedContractsLinkedListEntry(address, address) external view returns (bool, uint256, uint256) {}

  function whitelistedContractDetails(address, address) external view returns (MiddlewareDetails memory) {}
}
