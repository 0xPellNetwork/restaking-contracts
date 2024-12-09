// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

interface IUSDXMinting {
  /**
   * @notice Purchase USDX through supported stablecoins
   * @param _collateralAsset Collateral asset address
   * @param _collateralAmount Collateral asset amount
   * @param _custodianAddress Custodian address
   */
  function buy(address _collateralAsset, uint256 _collateralAmount, address _custodianAddress) external;

  function listSupportedAssets() external view returns (address[] memory);

  function listCustodians() external view returns (address[] memory);
}
