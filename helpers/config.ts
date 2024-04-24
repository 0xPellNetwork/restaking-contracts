import { ZERO_ADDRESS } from './constants';
import {
  IConfiguration,
  eArbitrumNetwork,
  eBounceBitNetwork,
  eEthereumNetwork,
  eMerlinNetwork,
} from './types';

export const Configs: IConfiguration = {
  StrategyConfigs: {
    [eEthereumNetwork.sepolia]: {
      WETH: {
        tokenAddress: '0xF7074a10589bA18b0d841E29Cd2a525591D3d7f5',
        tokenName: 'Wrapped ETH',
        tokenSymbol: 'WETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      wstETH: {
        tokenAddress: '0x459F01D23c366c157256889705Cc9B19637182e9',
        tokenName: 'Wrapped Lido Stake ETH',
        tokenSymbol: 'wstETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 7200,
      },
    },
    [eArbitrumNetwork.arbitrumSepolia]: {
      WETH: {
        tokenAddress: '0x0C519B951759C2f98BB1281324b1663C666bE128',
        tokenName: 'Wrapped ETH',
        tokenSymbol: 'WETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      wstETH: {
        tokenAddress: '0xb58B116e510b5E2a7C5C122Ec58181f613FfEd74',
        tokenName: 'Wrapped Lido Stake ETH',
        tokenSymbol: 'wstETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 7200,
      },
    },
    [eBounceBitNetwork.bbTestnet]: {
      BBTC: {
        tokenAddress: '0xAAE4fF62266C5814d7507066Bf55238BF66099f8',
        tokenName: 'BounceBit BTC',
        tokenSymbol: 'BBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      stBTC: {
        tokenAddress: '0x1fCf5744617D4AC02dFC4B9c850Fa73f47A11479',
        tokenName: 'Staked BTC',
        tokenSymbol: 'stBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 7200,
      },
    },
    [eMerlinNetwork.merlinTestnet]: {
      mBTC: {
        tokenAddress: '0xe6C7CFC9af124CC3561aDeaB160ed71115AB4B39',
        tokenName: 'Merlin BTC',
        tokenSymbol: 'mBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      stBTC: {
        tokenAddress: '0x0D6f819F9D798DBe8F52E7C913b2309056A5639c',
        tokenName: 'Staked BTC',
        tokenSymbol: 'stBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 7200,
      },
    },
  },
  MinWithdrawalDelay: {
    [eEthereumNetwork.sepolia]: 60,
    [eArbitrumNetwork.arbitrumSepolia]: 60,
    [eBounceBitNetwork.bbTestnet]: 60,
    [eMerlinNetwork.merlinTestnet]: 60,
  },
  StrategyManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 0,
    [eArbitrumNetwork.arbitrumSepolia]: 0,
    [eBounceBitNetwork.bbTestnet]: 0,
    [eMerlinNetwork.merlinTestnet]: 0,
  },
  DelegationManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 1, // pause new delegation
    [eArbitrumNetwork.arbitrumSepolia]: 1,
    [eBounceBitNetwork.bbTestnet]: 1,
    [eMerlinNetwork.merlinTestnet]: 1,
  },
  SlasherPausedStatus: {
    [eEthereumNetwork.sepolia]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eArbitrumNetwork.arbitrumSepolia]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBounceBitNetwork.bbTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eMerlinNetwork.merlinTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  },
  Owner: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0xc45cce6f84050f510b318c3a8a07eda0d009daf4',
  },
  WhiteLister: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
  },
  Pauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
  },
  Unpauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
  },
};
