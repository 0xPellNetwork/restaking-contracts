import { ZERO_ADDRESS } from './constants';
import {
  IConfiguration,
  eArbitrumNetwork,
  eBounceBitNetwork,
  eBscNetwork,
  eEthereumNetwork,
  eMerlinNetwork,
} from './types';

export const Configs: IConfiguration = {
  StrategyConfigs: {
    [eEthereumNetwork.sepolia]: {
      WBTC: {
        tokenAddress: '0x527dB0e9d0D9ECE260b69b94ac2d3602A227156d',
        tokenName: 'Wrapped BTC',
        tokenSymbol: 'WBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
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
    [eBscNetwork.bscTestnet]: {
      BTCB: {
        tokenAddress: '0xc287eaa0A3F1Ef22ffc6370f4e10Be80F497E57F',
        tokenName: 'Binance-Peg BTCB',
        tokenSymbol: 'BTCB',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
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
    [eEthereumNetwork.main]: {
      WBTC: {
        tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        tokenName: 'Wrapped BTC',
        tokenSymbol: 'WBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
    },
    [eBscNetwork.bsc]: {
      BTCB: {
        tokenAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        tokenName: 'Binance-Peg BTCB',
        tokenSymbol: 'BTCB',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
    },
    [eBounceBitNetwork.bb]: {
      BBTC: {
        tokenAddress: '0xF5e11df1ebCf78b6b6D26E04FF19cD786a1e81dC',
        tokenName: 'BounceBit BTC',
        tokenSymbol: 'stBBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
      stBBTC: {
        tokenAddress: '',
        tokenName: 'Staked BounceBit BTC',
        tokenSymbol: 'stBBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
    },
    [eMerlinNetwork.merlin]: {
      mBTC: {
        tokenAddress: '0xB880fd278198bd590252621d4CD071b1842E9Bcd',
        tokenName: "Merlin's Seal BTC",
        tokenSymbol: 'mBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
      SolvBTC: {
        tokenAddress: '0x41D9036454BE47d3745A823C4aaCD0e29cFB0f71',
        tokenName: 'Solv BTC',
        tokenSymbol: 'SolvBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 604800,
      },
    },
  },
  MinWithdrawalDelay: {
    [eEthereumNetwork.sepolia]: 60,
    [eArbitrumNetwork.arbitrumSepolia]: 60,
    [eBscNetwork.bscTestnet]: 60,
    [eBounceBitNetwork.bbTestnet]: 60,
    [eMerlinNetwork.merlinTestnet]: 60,
    [eBounceBitNetwork.bb]: 604800,
    [eMerlinNetwork.merlin]: 604800,
  },
  StrategyManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 0,
    [eArbitrumNetwork.arbitrumSepolia]: 0,
    [eBscNetwork.bscTestnet]: 0,
    [eBounceBitNetwork.bbTestnet]: 0,
    [eMerlinNetwork.merlinTestnet]: 0,
    [eBounceBitNetwork.bb]: 0,
    [eMerlinNetwork.merlin]: 0,
  },
  DelegationManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 1, // pause new delegation
    [eArbitrumNetwork.arbitrumSepolia]: 1,
    [eBscNetwork.bscTestnet]: 1,
    [eBounceBitNetwork.bbTestnet]: 1,
    [eMerlinNetwork.merlinTestnet]: 1,
    [eBounceBitNetwork.bb]: 1,
    [eMerlinNetwork.merlin]: 1,
  },
  SlasherPausedStatus: {
    [eEthereumNetwork.sepolia]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eArbitrumNetwork.arbitrumSepolia]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBscNetwork.bscTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBounceBitNetwork.bbTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eMerlinNetwork.merlinTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBounceBitNetwork.bb]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eMerlinNetwork.merlin]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  },
  Owner: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '',
    [eMerlinNetwork.merlin]: '0xd41Ea5b3AbB4AE2fA2097EB081823291dAecC7c4',
  },
  WhiteLister: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '',
    [eMerlinNetwork.merlin]: '0x853b480f808073c63A71C817277222D9901f3454',
  },
  Pauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '',
    [eMerlinNetwork.merlin]: '0xB24e18BBD4918d4c2796D8D4de697bc14aec56Fb',
  },
  Unpauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '',
    [eMerlinNetwork.merlin]: '0x04a1C7D8e143648903fB7444da93995830ACe6ad',
  },
};
