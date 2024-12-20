// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IStakedUSDXGateway {
  event UpdateUSDXMinting(address previousUSDXMinting, address newUSDXMinting);

  function depositUSDX(uint256 _amount) external;
  function depositERC20Token(address _collateralAsset, uint256 _collateralAmount, address _custodianAddress) external;
}
