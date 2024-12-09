// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IUSDXMinting} from '../interfaces/IUSDXMinting.sol';
import {IStrategy} from '../interfaces/IStrategy.sol';
import {IStrategyManagerV2} from '../interfaces/IStrategyManagerV2.sol';
import {IUSDXGateway} from '../interfaces/IUSDXGateway.sol';

contract USDXGateway is IUSDXGateway, Ownable {
  using SafeERC20 for IERC20;

  IERC20 internal immutable usdx;
  IStrategy internal immutable strategy;
  IStrategyManagerV2 internal immutable strategyManager;

  IUSDXMinting internal usdxMinting;

  constructor(address _usdx, address _usdxMinting, address _owner, IStrategy _strategy, IStrategyManagerV2 _strategyManager) {
    usdx = IERC20(_usdx);
    usdxMinting = IUSDXMinting(_usdxMinting);
    strategy = _strategy;
    strategyManager = _strategyManager;
    _transferOwnership(_owner);
    IERC20(_usdx).approve(address(strategyManager), type(uint256).max);
  }

  function depositERC20Token(address _collateralAsset, uint256 _collateralAmount, address _custodianAddress) external override {
    IERC20(_collateralAsset).safeTransferFrom(msg.sender, address(this), _collateralAmount);
    IERC20(_collateralAsset).forceApprove(address(usdxMinting), _collateralAmount);
    uint256 beforeBalance = usdx.balanceOf(address(this));
    usdxMinting.buy(_collateralAsset, _collateralAmount, _custodianAddress);
    uint256 afterBalance = usdx.balanceOf(address(this));
    uint256 amountToStake = afterBalance - beforeBalance;
    strategyManager.depositIntoStrategyWithStaker(msg.sender, strategy, IERC20(address(usdx)), amountToStake);
  }

  /**
   * @dev transfer ERC20 from the utility contract, for ERC20 recovery in case of stuck tokens due
   * direct transfers to the contract address.
   * @param token token to transfer
   * @param to recipient of the transfer
   * @param amount amount to send
   */
  function emergencyTokenTransfer(address token, address to, uint256 amount) external onlyOwner {
    IERC20(token).safeTransfer(to, amount);
  }

  /**
   * @dev Update USDX Minting address
   * @param _newUSDXMintingAddress New USDX Minting address
   */
  function updateUSDXMinting(address _newUSDXMintingAddress) external onlyOwner {
    emit UpdateUSDXMinting(address(usdxMinting), _newUSDXMintingAddress);
    usdxMinting = IUSDXMinting(_newUSDXMintingAddress);
  }

  /**
   * @dev Get USDX address used by USDXGateway
   */
  function getUSDXAddress() external view returns (address) {
    return address(usdx);
  }

  /**
   * @dev Get USDX Minting address used by USDXGateway
   */
  function getUSDXMintingAddress() external view returns (address) {
    return address(usdxMinting);
  }

  /**
   * @dev Get USDX Minting supported collateral assets
   */
  function getUSDXMintingSupportedAssets() public view returns (address[] memory) {
    return usdxMinting.listSupportedAssets();
  }

  /**
   * @dev Get USDX Minting supported custodian address
   */
  function getUSDXMintingSupportedCustodians() public view returns (address[] memory) {
    return usdxMinting.listCustodians();
  }

  /**
   * @dev Get USDX strategy address used by USDXGateway
   */
  function getStrategyAddress() external view returns (address) {
    return address(strategy);
  }
}
