import { ZERO_ADDRESS } from './constants';
import {
  IConfiguration,
  eArbitrumNetwork,
  eBitLayerNetwork,
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
      bBBTC: {
        tokenAddress: '0x3500a097646E5D04Ff1293b042f7A08a541E925c',
        tokenName: 'LenB BounceBit BBTC',
        tokenSymbol: 'bBBBBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 120,
      },
      stBBTC: {
        tokenAddress: '0xE3A844a2a9474ac7B5a15cBA4B1a02A83d40d0Ed',
        tokenName: 'Staked BBTC',
        tokenSymbol: 'stBBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      wstBBTC: {
        tokenAddress: '0x4c630374F7ee11c69F0a5C786a1f435D6EBd5375',
        tokenName: 'Wrapped Staked BBTC',
        tokenSymbol: 'wstBBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
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
      aMETH: {
        tokenAddress: '0xbeB84B8E99D29b051E9f501553f9a6fa28b27888',
        tokenName: 'AVALON Merlin ETH',
        tokenSymbol: 'aMETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 120,
      },
      aMUSDT: {
        tokenAddress: '0x2cb2C80e66eD830C52e5a7dd7ef399e89893C385',
        tokenName: 'AVALON Merlin USDT',
        tokenSymbol: 'aMUSDT',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 120,
      },
    },
    [eBitLayerNetwork.bitlayerTestnet]: {
      WBTC: {
        tokenAddress: '0x559852401e545f941F275B5674afAfcb1b51D147',
        tokenName: 'Wrapped BTC',
        tokenSymbol: 'WBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      WETH: {
        tokenAddress: '0xd7c2Ddf974F274e28D59a394C170464CDcDE7D62',
        tokenName: 'Wrapped ETH',
        tokenSymbol: 'WETH',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      SolvBTC: {
        tokenAddress: '0xe8Cb1693Fe782f28EBafd55B4c94085722FBB89B',
        tokenName: 'Solv BTC',
        tokenSymbol: 'SolvBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
      },
      ZBTC: {
        tokenAddress: '0xa82088085da51a1Ee582fa037344C9BC3bEa7Bc8',
        tokenName: 'ZBTC',
        tokenSymbol: 'ZBTC',
        maxPerDeposit:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        maxDeposits:
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        withdrawalDelay: 180,
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
    [eBounceBitNetwork.bb]: {
      BBTC: {
        tokenAddress: '0xF5e11df1ebCf78b6b6D26E04FF19cD786a1e81dC',
        tokenName: 'BounceBit BTC',
        tokenSymbol: 'BBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '1500000000000000000000',
        withdrawalDelay: 604800,
      },
      stBBTC: {
        tokenAddress: '0x7F150c293c97172C75983BD8ac084c187107eA19',
        tokenName: 'Staked BounceBit BTC',
        tokenSymbol: 'stBBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '1500000000000000000000',
        withdrawalDelay: 604800,
      },
      wstBBTC: {
        tokenAddress: '0x8f083EaFcbba2e126AD9757639c3A1E25a061A08',
        tokenName: 'Wrapped Staked BounceBit BTC',
        tokenSymbol: 'wstBBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '1500000000000000000000',
        withdrawalDelay: 604800,
      },
    },
    [eMerlinNetwork.merlin]: {
      mBTC: {
        tokenAddress: '0xB880fd278198bd590252621d4CD071b1842E9Bcd',
        tokenName: "Merlin's Seal BTC",
        tokenSymbol: 'mBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '1000000000000000000000',
        withdrawalDelay: 604800,
      },
      SolvBTC: {
        tokenAddress: '0x41D9036454BE47d3745A823C4aaCD0e29cFB0f71',
        tokenName: 'Solv BTC',
        tokenSymbol: 'SolvBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '1000000000000000000000',
        withdrawalDelay: 604800,
      },
      aWBTC: {
        tokenAddress: '0xA984b70f7B41EE736B487D5F3D9C1e1026476Ea3',
        tokenName: 'Avalon Merlin Wrapped BTC',
        tokenSymbol: 'aMerWBTC',
        maxPerDeposit: '20000000000000000000',
        maxDeposits: '20000000000000000000',
        withdrawalDelay: 259200,
      },
      aMBTC: {
        tokenAddress: '0xF5b689D772e4Bd839AD9247A326A21a0A74a07f0',
        tokenName: "Avalon Merlin's Seal BTC",
        tokenSymbol: 'aMerMBTC',
        maxPerDeposit: '20000000000000000000',
        maxDeposits: '20000000000000000000',
        withdrawalDelay: 259200,
      },
      aSolvBTC: {
        tokenAddress: '0xC39E757dCb2b17B79A411eA1C2810735dc9032F8',
        tokenName: 'Avalon Solv BTC',
        tokenSymbol: 'aMerSolvBTC',
        maxPerDeposit: '500000000000000000000',
        maxDeposits: '500000000000000000000',
        withdrawalDelay: 259200,
      },
    },
    [eBitLayerNetwork.bitlayer]: {
      WBTC: {
        tokenAddress: '0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f',
        tokenName: 'Wrapped BTC',
        tokenSymbol: 'WBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '2000000000000000000000',
        withdrawalDelay: 604800,
      },
      aWBTC: {
        tokenAddress: '0xA984b70f7B41EE736B487D5F3D9C1e1026476Ea3',
        tokenName: 'Avalon Bitlayer Wrapped BTC',
        tokenSymbol: 'aBitWBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '100000000000000000000',
        withdrawalDelay: 259200,
      },
      stBTC: {
        tokenAddress: '0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3',
        tokenName: 'Lorenzo Staked BTC',
        tokenSymbol: 'stBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '2000000000000000000000',
        withdrawalDelay: 604800,
      },
      ZBTC: {
        tokenAddress: '0xd53E6f1d37f430d84eFad8060F9Fec558B36F6fa',
        tokenName: 'Zearn Staked BTC',
        tokenSymbol: 'ZBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '2000000000000000000000',
        withdrawalDelay: 604800,
      },
      aSTBTC: {
        tokenAddress: '0x9A6Ae5622990BA5eC1691648c3A2872469d161f9',
        tokenName: 'Avalon Bitlayer Lorenzo stBTC',
        tokenSymbol: 'aSTBTC',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '100000000000000000000',
        withdrawalDelay: 259200,
      },
    },
    [eBscNetwork.bsc]: {
      BTCB: {
        tokenAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        tokenName: 'Binance-Peg BTCB',
        tokenSymbol: 'BTCB',
        maxPerDeposit: '100000000000000000000',
        maxDeposits: '3000000000000000000000',
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
    [eBitLayerNetwork.bitlayerTestnet]: 60,
    [eBounceBitNetwork.bb]: 604800,
    [eMerlinNetwork.merlin]: 604800,
    [eBitLayerNetwork.bitlayer]: 604800,
    [eBscNetwork.bsc]: 259200,
  },
  StrategyManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 0,
    [eArbitrumNetwork.arbitrumSepolia]: 0,
    [eBscNetwork.bscTestnet]: 0,
    [eBounceBitNetwork.bbTestnet]: 0,
    [eMerlinNetwork.merlinTestnet]: 0,
    [eBitLayerNetwork.bitlayerTestnet]: 0,
    [eBounceBitNetwork.bb]: 0,
    [eMerlinNetwork.merlin]: 0,
    [eBitLayerNetwork.bitlayer]: 0,
    [eBscNetwork.bsc]: 0,
  },
  DelegationManagerPausedStatus: {
    [eEthereumNetwork.sepolia]: 1, // pause new delegation
    [eArbitrumNetwork.arbitrumSepolia]: 1,
    [eBscNetwork.bscTestnet]: 1,
    [eBounceBitNetwork.bbTestnet]: 1,
    [eMerlinNetwork.merlinTestnet]: 1,
    [eBitLayerNetwork.bitlayerTestnet]: 1,
    [eBounceBitNetwork.bb]: 1,
    [eMerlinNetwork.merlin]: 1,
    [eBitLayerNetwork.bitlayer]: 1,
    [eBscNetwork.bsc]: 1,
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
    [eBitLayerNetwork.bitlayerTestnet]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBounceBitNetwork.bb]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eMerlinNetwork.merlin]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBitLayerNetwork.bitlayer]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    [eBscNetwork.bsc]:
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  },
  RewardsDuration: {
    [eBounceBitNetwork.bbTestnet]: 3600,
    [eBounceBitNetwork.bb]: 86400,
  },
  Owner: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBitLayerNetwork.bitlayerTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0x1297d797aC69da9Bd6260E5D932a4bB645b0cB69',
    [eMerlinNetwork.merlin]: '0xd41Ea5b3AbB4AE2fA2097EB081823291dAecC7c4',
    [eBitLayerNetwork.bitlayer]: '0x45B4e188d2F76fcF5Df98E8f21C7E8d2F63e1402',
    [eBscNetwork.bsc]: '0x45B4e188d2F76fcF5Df98E8f21C7E8d2F63e1402',
  },
  WhiteLister: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBitLayerNetwork.bitlayerTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0x1B713049ea6d4490392687B62acaF731cD3e34C6',
    [eMerlinNetwork.merlin]: '0x853b480f808073c63A71C817277222D9901f3454',
    [eBitLayerNetwork.bitlayer]: '0x8C1362DB0eb0942C9aFdbEBb7E2Cdfdb9c649D15',
    [eBscNetwork.bsc]: '0x8C1362DB0eb0942C9aFdbEBb7E2Cdfdb9c649D15',
  },
  Pauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBitLayerNetwork.bitlayerTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0x3f31a0Fa55d605286176500017CCd49bcc79A1e8',
    [eMerlinNetwork.merlin]: '0xB24e18BBD4918d4c2796D8D4de697bc14aec56Fb',
    [eBitLayerNetwork.bitlayer]: '0x2A67AA8B595fFC05c5567ab47992DfB00ebe02f6',
    [eBscNetwork.bsc]: '0x2A67AA8B595fFC05c5567ab47992DfB00ebe02f6',
  },
  Unpauser: {
    [eEthereumNetwork.sepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eArbitrumNetwork.arbitrumSepolia]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBscNetwork.bscTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eMerlinNetwork.merlinTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBitLayerNetwork.bitlayerTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0xBA932f31e1f7641f5E1CB8640eDd409DF73636ce',
    [eMerlinNetwork.merlin]: '0x04a1C7D8e143648903fB7444da93995830ACe6ad',
    [eBitLayerNetwork.bitlayer]: '0xc203bEDb784a3Ee7eBEADa33CfDc1A2409395522',
    [eBscNetwork.bsc]: '0xc203bEDb784a3Ee7eBEADa33CfDc1A2409395522',
  },
  Operator: {
    [eBounceBitNetwork.bbTestnet]: '0xcbeD65Db7E177D4875dDF5B67E13326A43a7B03f',
    [eBounceBitNetwork.bb]: '0xc8810eCCeC4098f641a842cC401648220B756c3C',
  },
};
