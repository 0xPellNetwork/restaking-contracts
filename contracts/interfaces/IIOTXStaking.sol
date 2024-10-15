// SPDX-License-Identifier: LGPL-3.0

pragma solidity 0.8.20;

import {IERC721Receiver} from '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

interface IIOTXStaking is IERC721Receiver {
  function exchangeRatio() external returns (uint256 ratio);
  function currentReserve() external view returns (uint256);
  function redeemAmountBase() external returns (uint256);
  function getRedeemedTokenIdSlice(uint256 i, uint256 j) external view returns (uint256[] memory tokenIds);
  function getStakedTokenCount(uint256 tokenQueueIndex) external view returns (uint256 count);
  function setGlobalDelegate(address delegate) external;
  function updateDelegates(uint256[] calldata tokenIds, address delegate) external;
  function deposit(uint256 deadline) external payable returns (uint256 minted);
  function stake() external;
  function redeem(uint256 iotxsToRedeem, uint256 deadline) external returns (uint256 burned);
  function updateReward() external;
  function withdrawManagerFee(uint256 amount, address recipient) external;
}
