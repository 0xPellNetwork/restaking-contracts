// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import {ERC20, IERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {Address} from '@openzeppelin/contracts/utils/Address.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

interface IMintableContract is IERC20 {
  function mint(address account, uint256 amount) external;
  function burn(uint256 amount) external;
  function burnFrom(address account, uint256 amount) external;
}

contract UniBTCVault is Ownable {
  using SafeERC20 for IERC20;
  using Address for address payable;

  address public constant NATIVE_BTC = address(0xbeDFFfFfFFfFfFfFFfFfFFFFfFFfFFffffFFFFFF);
  uint8 public constant NATIVE_BTC_DECIMALS = 18;
  uint256 public constant EXCHANGE_RATE_BASE = 1e10;

  address public immutable uniBTC;

  mapping(address => uint256) public caps;

  constructor(address _uniBTC) {
    uniBTC = _uniBTC;
  }

  /**
   * @dev mint uniBTC with native BTC
   */
  function mint() external payable {
    _mint(msg.sender, msg.value);
  }

  /**
   * @dev mint uniBTC with the given type of wrapped BTC
   */
  function mint(address _token, uint256 _amount) external {
    _mint(msg.sender, _token, _amount);
  }

  /**
   * @dev burn uniBTC and redeem native BTC
   */
  function redeem(uint256 _amount) external {
    _redeem(msg.sender, _amount);
  }

  /**
   * @dev burn uniBTC and redeem the given type of wrapped BTC
   */
  function redeem(address _token, uint256 _amount) external {
    _redeem(msg.sender, _token, _amount);
  }

  /**
   * @dev set cap for a specific type of wrapped BTC
   */
  function setCap(address _token, uint256 _cap) external onlyOwner {
    require(_token != address(0x0), 'SYS003');

    uint8 decs = NATIVE_BTC_DECIMALS;

    if (_token != NATIVE_BTC) decs = ERC20(_token).decimals();

    require(decs == 8 || decs == 18, 'SYS004');

    caps[_token] = _cap;
  }

  /**
   * ======================================================================================
   *
   * INTERNAL
   *
   * ======================================================================================
   */

  /**
   * @dev mint uniBTC with native BTC tokens
   */
  function _mint(address _sender, uint256 _amount) internal {
    (, uint256 uniBTCAmount) = _amounts(_amount);
    require(uniBTCAmount > 0, 'USR010');

    require(address(this).balance <= caps[NATIVE_BTC], 'USR003');

    IMintableContract(uniBTC).mint(_sender, uniBTCAmount);

    emit Minted(NATIVE_BTC, _amount);
  }

  /**
   * @dev mint uniBTC with wrapped BTC tokens
   */
  function _mint(address _sender, address _token, uint256 _amount) internal {
    (, uint256 uniBTCAmount) = _amounts(_token, _amount);
    require(uniBTCAmount > 0, 'USR010');

    require(IERC20(_token).balanceOf(address(this)) + _amount <= caps[_token], 'USR003');

    IERC20(_token).safeTransferFrom(_sender, address(this), _amount);
    IMintableContract(uniBTC).mint(_sender, uniBTCAmount);

    emit Minted(_token, _amount);
  }

  /**
   * @dev burn uniBTC and return native BTC tokens
   */
  function _redeem(address _sender, uint256 _amount) internal {
    (uint256 actualAmount, uint256 uniBTCAmount) = _amounts(_amount);
    require(uniBTCAmount > 0, 'USR010');

    IMintableContract(uniBTC).burnFrom(_sender, uniBTCAmount);
    emit Redeemed(NATIVE_BTC, _amount);

    payable(_sender).sendValue(actualAmount);
  }

  /**
   * @dev burn uniBTC and return wrapped BTC tokens
   */
  function _redeem(address _sender, address _token, uint256 _amount) internal {
    (uint256 actualAmount, uint256 uniBTCAmount) = _amounts(_token, _amount);
    require(uniBTCAmount > 0, 'USR010');

    IMintableContract(uniBTC).burnFrom(_sender, uniBTCAmount);
    IERC20(_token).safeTransfer(_sender, actualAmount);

    emit Redeemed(_token, _amount);
  }

  /**
   * @dev determine the valid native BTC amount and the corresponding uniBTC amount.
   */
  function _amounts(uint256 _amount) internal pure returns (uint256, uint256) {
    uint256 uniBTCAmt = _amount / EXCHANGE_RATE_BASE;
    return (uniBTCAmt * EXCHANGE_RATE_BASE, uniBTCAmt);
  }

  /**
   * @dev determine the valid wrapped BTC amount and the corresponding uniBTC amount.
   */
  function _amounts(address _token, uint256 _amount) internal view returns (uint256, uint256) {
    uint8 decs = ERC20(_token).decimals();
    if (decs == 8) return (_amount, _amount);
    if (decs == 18) {
      uint256 uniBTCAmt = _amount / EXCHANGE_RATE_BASE;
      return (uniBTCAmt * EXCHANGE_RATE_BASE, uniBTCAmt);
    }
    return (0, 0);
  }

  /**
   * ======================================================================================
   *
   * EVENTS
   *
   * ======================================================================================
   */
  event Withdrawed(address token, uint256 amount, address target);
  event Minted(address token, uint256 amount);
  event Redeemed(address token, uint256 amount);
  event TokenPaused(address token);
  event TokenUnpaused(address token);
  event RedemptionOn();
  event RedemptionOff();
}
