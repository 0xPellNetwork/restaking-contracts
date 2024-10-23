import {
  ARBISCAN_KEY,
  BASESCAN_KEY,
  BSCSCAN_KEY,
  BSQUAREDSCAN_KEY,
  CORESCAN_KEY,
  CORESCAN_TESTNET_KEY,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
  MERLINSCAN_KEY,
  SCROLLSCAN_KEY,
  ZETASCAN_KEY,
  ZETASCAN_TESTNET_KEY,
  ZKSYNCSCAN_KEY,
} from './helpers/hardhat-config-helpers';
import {
  eAILayerNetwork,
  eArbitrumNetwork,
  eBaseNetwork,
  eBEVMNetwork,
  eBitLayerNetwork,
  eBOBNetwork,
  eBounceBitNetwork,
  eBscNetwork,
  eBSquaredNetwork,
  eCoreNetwork,
  eEthereumNetwork,
  eIoTeXNetwork,
  eMantleNetwork,
  eMerlinNetwork,
  eModeNetwork,
  eRootstockNetwork,
  eScrollNetwork,
  eZetaChainNetwork,
  eZKSyncNetwork,
} from './helpers/types';
import { DEFAULT_NAMED_ACCOUNTS } from './helpers/constants';

import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import 'hardhat-dependency-compiler';
import '@nomiclabs/hardhat-ethers';
import '@matterlabs/hardhat-zksync-solc';
// import '@matterlabs/hardhat-zksync-verify';

const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
const TASK_FOLDERS = ['misc', 'op'];

// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
  loadTasks(TASK_FOLDERS);
}

export default {
  external: {
    contracts: [
      {
        artifacts: 'node_modules/@openzeppelin/upgrades-core/artifacts',
      },
    ],
  },
  dependencyCompiler: {
    paths: [
      '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol',
      '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol',
    ],
  },
  abiExporter: {
    path: './abis', // path to ABI export directory (relative to Hardhat root)
    runOnCompile: true, // whether to automatically export ABIs during compilation
    clear: true, // whether to delete old ABI files in path on compilation
    flat: true, // whether to flatten output directory (may cause name collisions)
    pretty: false, // whether to use interface-style formatting of output for better readability
    except: ['@openzeppelin/contracts'],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: { enabled: true, runs: 1_500 },
          evmVersion: 'berlin',
        },
      },
      {
        version: '0.8.9',
        settings: {
          optimizer: { enabled: true, runs: 1_500 },
          evmVersion: 'berlin',
        },
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: { enabled: true, runs: 1_500 },
          evmVersion: 'berlin',
        },
      },
    ],
  },
  zksolc: {
    version: 'latest',
    settings: {
      optimizer: {
        optimizer: { enabled: true, runs: 20_000 },
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  gasReporter: {
    enabled: false,
  },
  networks: {
    hardhat: {
      ...hardhatNetworkSettings,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      ...hardhatNetworkSettings,
    },
    [eEthereumNetwork.main]: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(eEthereumNetwork.sepolia, 11155111),
    [eArbitrumNetwork.arbitrum]: {
      ...getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
      verify: {
        etherscan: {
          apiKey: ARBISCAN_KEY,
        },
      },
    },
    [eArbitrumNetwork.arbitrumSepolia]: {
      ...getCommonNetworkConfig(eArbitrumNetwork.arbitrumSepolia, 421614),
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia.arbiscan.io',
          apiKey: ARBISCAN_KEY,
        },
      },
    },
    [eBaseNetwork.base]: {
      ...getCommonNetworkConfig(eBaseNetwork.base, 8453),
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org',
          apiKey: BASESCAN_KEY,
        },
      },
    },
    [eBaseNetwork.baseGoerli]: {
      ...getCommonNetworkConfig(eBaseNetwork.baseGoerli, 84531),
      verify: {
        etherscan: {
          apiUrl: 'https://api-goerli.basescan.org',
          apiKey: BASESCAN_KEY,
        },
      },
    },
    [eBaseNetwork.baseSepolia]: {
      ...getCommonNetworkConfig(eBaseNetwork.baseSepolia, 84532),
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia.basescan.org',
          apiKey: BASESCAN_KEY,
        },
      },
    },
    [eBscNetwork.bsc]: {
      ...getCommonNetworkConfig(eBscNetwork.bsc, 56),
      verify: {
        etherscan: {
          apiUrl: 'https://api.bscscan.com',
          apiKey: BSCSCAN_KEY,
        },
      },
    },
    [eBscNetwork.bscTestnet]: {
      ...getCommonNetworkConfig(eBscNetwork.bscTestnet, 97),
      verify: {
        etherscan: {
          apiUrl: 'https://api-testnet.bscscan.com',
          apiKey: BSCSCAN_KEY,
        },
      },
    },
    [eMantleNetwork.mantle]: {
      ...getCommonNetworkConfig(eMantleNetwork.mantle, 5000),
      verify: {
        etherscan: {
          apiUrl: 'https://explorer.mantle.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eMantleNetwork.mantleTestnet]: {
      ...getCommonNetworkConfig(eMantleNetwork.mantleTestnet, 5003),
      verify: {
        etherscan: {
          apiUrl: 'https://explorer.sepolia.mantle.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eZetaChainNetwork.zeta]: {
      ...getCommonNetworkConfig(eZetaChainNetwork.zeta, 7000),
      verify: {
        etherscan: {
          apiUrl: 'https://zetachain.blockscout.com',
          apiKey: ZETASCAN_KEY,
        },
      },
    },
    [eZetaChainNetwork.zetaTestnet]: {
      ...getCommonNetworkConfig(eZetaChainNetwork.zetaTestnet, 7001),
      verify: {
        etherscan: {
          apiUrl: 'https://zetachain-athens-3.blockscout.com',
          apiKey: ZETASCAN_TESTNET_KEY,
        },
      },
    },
    [eBounceBitNetwork.bbTestnet]: {
      ...getCommonNetworkConfig(eBounceBitNetwork.bbTestnet, 6000),
    },
    [eBounceBitNetwork.bb]: {
      ...getCommonNetworkConfig(eBounceBitNetwork.bb, 6001),
    },
    [eMerlinNetwork.merlin]: {
      ...getCommonNetworkConfig(eMerlinNetwork.merlin, 4200),
      verify: {
        etherscan: {
          apiUrl: 'https://scan.merlinchain.io',
          apiKey: MERLINSCAN_KEY,
        },
      },
    },
    [eMerlinNetwork.merlinTestnet]: {
      ...getCommonNetworkConfig(eMerlinNetwork.merlinTestnet, 686868),
      verify: {
        etherscan: {
          apiUrl: 'https://testnet-scan.merlinchain.io',
          apiKey: MERLINSCAN_KEY,
        },
      },
    },
    [eBSquaredNetwork.bsquared]: {
      ...getCommonNetworkConfig(eBSquaredNetwork.bsquared, 223),
      verify: {
        etherscan: {
          apiUrl: 'https://explorer.bsquared.network',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBSquaredNetwork.bsquaredTestnet]: {
      ...getCommonNetworkConfig(eBSquaredNetwork.bsquaredTestnet, 1123),
      verify: {
        etherscan: {
          apiUrl: 'https://testnet-explorer.bsquared.network',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBitLayerNetwork.bitlayer]: {
      ...getCommonNetworkConfig(eBitLayerNetwork.bitlayer, 200901),
      verify: {
        etherscan: {
          apiUrl: 'https://api.btrscan.com/scan',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBitLayerNetwork.bitlayerTestnet]: {
      ...getCommonNetworkConfig(eBitLayerNetwork.bitlayerTestnet, 200810),
      verify: {
        etherscan: {
          apiUrl: 'https://api-testnet.btrscan.com/scan',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBEVMNetwork.bevm]: {
      ...getCommonNetworkConfig(eBEVMNetwork.bevm, 11501),
      verify: {
        etherscan: {
          apiUrl: 'https://scan-mainnet-api.bevm.io',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBEVMNetwork.bevmTestnet]: {
      ...getCommonNetworkConfig(eBEVMNetwork.bevmTestnet, 11503),
      verify: {
        etherscan: {
          apiUrl: 'https://scan-testnet-api.bevm.io',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eCoreNetwork.core]: {
      ...getCommonNetworkConfig(eCoreNetwork.core, 1116),
      verify: {
        etherscan: {
          apiUrl: 'https://openapi.coredao.org',
          apiKey: CORESCAN_KEY,
        },
      },
    },
    [eCoreNetwork.coreTestnet]: {
      ...getCommonNetworkConfig(eCoreNetwork.coreTestnet, 1115),
      verify: {
        etherscan: {
          apiUrl: 'https://scan.test.btcs.network',
          apiKey: CORESCAN_TESTNET_KEY,
        },
      },
    },
    [eScrollNetwork.scroll]: {
      ...getCommonNetworkConfig(eScrollNetwork.scroll, 534352),
      verify: {
        etherscan: {
          apiUrl: 'https://api.scrollscan.com',
          apiKey: SCROLLSCAN_KEY,
        },
      },
    },
    [eScrollNetwork.scrollTestnet]: {
      ...getCommonNetworkConfig(eScrollNetwork.scrollTestnet, 534351),
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia.scrollscan.com',
          apiKey: SCROLLSCAN_KEY,
        },
      },
    },
    [eBOBNetwork.bob]: {
      ...getCommonNetworkConfig(eBOBNetwork.bob, 60808),
      verify: {
        etherscan: {
          apiUrl: 'https://explorer.gobob.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eBOBNetwork.bobTestnet]: {
      ...getCommonNetworkConfig(eBOBNetwork.bobTestnet, 111),
      verify: {
        etherscan: {
          apiUrl: 'https://testnet-explorer.gobob.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eAILayerNetwork.ailayer]: {
      ...getCommonNetworkConfig(eAILayerNetwork.ailayer, 2649),
      verify: {
        etherscan: {
          apiUrl: 'https://mainnet-explorer.ailayer.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eAILayerNetwork.ailayerTestnet]: {
      ...getCommonNetworkConfig(eAILayerNetwork.ailayerTestnet, 2648),
      verify: {
        etherscan: {
          apiUrl: 'https://testnet-explorer.ailayer.xyz',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eModeNetwork.mode]: {
      ...getCommonNetworkConfig(eModeNetwork.mode, 34443),
      verify: {
        etherscan: {
          apiUrl: 'https://explorer.mode.network',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eModeNetwork.modeTestnet]: {
      ...getCommonNetworkConfig(eModeNetwork.modeTestnet, 919),
      verify: {
        etherscan: {
          apiUrl: 'https://sepolia.explorer.mode.network',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eZKSyncNetwork.zksync]: {
      ...getCommonNetworkConfig(eZKSyncNetwork.zksync, 324),
      verify: {
        etherscan: {
          apiUrl: 'https://api-era.zksync.network',
          apiKey: ZKSYNCSCAN_KEY,
        },
      },
      zksync: true,
      ethNetwork: 'mainnet',
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
    },
    [eZKSyncNetwork.zksyncTestnet]: {
      ...getCommonNetworkConfig(eZKSyncNetwork.zksyncTestnet, 300),
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia-era.zksync.network',
          apiKey: ZKSYNCSCAN_KEY,
        },
      },
      zksync: true,
      ethNetwork: 'sepolia',
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
    },
    [eIoTeXNetwork.iotex]: {
      ...getCommonNetworkConfig(eIoTeXNetwork.iotex, 4689),
      verify: {
        etherscan: {
          apiUrl: 'https://iotexscout.io',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eIoTeXNetwork.iotexTestnet]: {
      ...getCommonNetworkConfig(eIoTeXNetwork.iotexTestnet, 4690),
      verify: {
        etherscan: {
          apiUrl: 'https://testnet.iotexscout.io',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eRootstockNetwork.rsk]: {
      ...getCommonNetworkConfig(eRootstockNetwork.rsk, 30),
      verify: {
        etherscan: {
          apiUrl: 'https://rootstock.blockscout.com',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
    [eRootstockNetwork.rskTestnet]: {
      ...getCommonNetworkConfig(eRootstockNetwork.rskTestnet, 31),
      verify: {
        etherscan: {
          apiUrl: 'https://rootstock-testnet.blockscout.com',
          apiKey: ETHERSCAN_KEY,
        },
      },
    },
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_KEY,
      sepolia: ETHERSCAN_KEY,
      goerli: ETHERSCAN_KEY,
      arbitrumOne: ARBISCAN_KEY,
      [eArbitrumNetwork.arbitrumSepolia]: ARBISCAN_KEY,
      [eBaseNetwork.base]: BASESCAN_KEY,
      [eBaseNetwork.baseGoerli]: BASESCAN_KEY,
      [eBaseNetwork.baseSepolia]: BASESCAN_KEY,
      [eBscNetwork.bsc]: BSCSCAN_KEY,
      [eBscNetwork.bscTestnet]: BSCSCAN_KEY,
      [eMantleNetwork.mantle]: ETHERSCAN_KEY,
      [eMantleNetwork.mantleTestnet]: ETHERSCAN_KEY,
      [eZetaChainNetwork.zeta]: ZETASCAN_KEY,
      [eZetaChainNetwork.zetaTestnet]: ZETASCAN_TESTNET_KEY,
      [eMerlinNetwork.merlin]: MERLINSCAN_KEY,
      [eBSquaredNetwork.bsquared]: BSQUAREDSCAN_KEY,
      [eBSquaredNetwork.bsquaredTestnet]: BSQUAREDSCAN_KEY,
      [eBitLayerNetwork.bitlayer]: ETHERSCAN_KEY,
      [eBitLayerNetwork.bitlayerTestnet]: ETHERSCAN_KEY,
      [eBEVMNetwork.bevm]: ETHERSCAN_KEY,
      [eBEVMNetwork.bevmTestnet]: ETHERSCAN_KEY,
      [eCoreNetwork.core]: CORESCAN_KEY,
      [eCoreNetwork.coreTestnet]: CORESCAN_TESTNET_KEY,
      [eScrollNetwork.scroll]: SCROLLSCAN_KEY,
      [eScrollNetwork.scrollTestnet]: SCROLLSCAN_KEY,
      [eBOBNetwork.bob]: ETHERSCAN_KEY,
      [eBOBNetwork.bobTestnet]: ETHERSCAN_KEY,
      [eAILayerNetwork.ailayer]: ETHERSCAN_KEY,
      [eAILayerNetwork.ailayerTestnet]: ETHERSCAN_KEY,
      [eModeNetwork.mode]: ETHERSCAN_KEY,
      [eModeNetwork.modeTestnet]: ETHERSCAN_KEY,
      [eZKSyncNetwork.zksync]: ZKSYNCSCAN_KEY,
      [eZKSyncNetwork.zksyncTestnet]: ZKSYNCSCAN_KEY,
      [eIoTeXNetwork.iotex]: ETHERSCAN_KEY,
      [eIoTeXNetwork.iotexTestnet]: ETHERSCAN_KEY,
      [eRootstockNetwork.rsk]: ETHERSCAN_KEY,
      [eRootstockNetwork.rskTestnet]: ETHERSCAN_KEY,
    },
    customChains: [
      {
        network: 'arbitrum-sepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'base-goerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org',
        },
      },
      {
        network: 'base-sepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'bsc',
        chainId: 56,
        urls: {
          apiURL: 'https://api.bscscan.com/api',
          browserURL: 'https://bscscan.com/',
        },
      },
      {
        network: 'bsc-testnet',
        chainId: 97,
        urls: {
          apiURL: 'https://api-testnet.bscscan.com/api',
          browserURL: 'https://testnet.bscscan.com/',
        },
      },
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz',
        },
      },
      {
        network: 'mantle-testnet',
        chainId: 5003,
        urls: {
          apiURL: 'https://explorer.sepolia.mantle.xyz/api',
          browserURL: 'https://explorer.sepolia.mantle.xyz',
        },
      },
      {
        network: 'zeta',
        chainId: 7000,
        urls: {
          apiURL: 'https://zetachain.blockscout.com/api',
          browserURL: 'https://zetachain.blockscout.com',
        },
      },
      {
        network: 'zeta-testnet',
        chainId: 7001,
        urls: {
          apiURL: 'https://zetachain-athens-3.blockscout.com/api',
          browserURL: 'https://zetachain-athens-3.blockscout.com',
        },
      },
      {
        network: 'merlin',
        chainId: 4200,
        urls: {
          apiURL: 'https://scan.merlinchain.io/api',
          browserURL: 'https://scan.merlinchain.io',
        },
      },
      {
        network: 'bsquared',
        chainId: 223,
        urls: {
          apiURL: 'https://explorer.bsquared.network/api',
          browserURL: 'https://explorer.bsquared.network',
        },
      },
      {
        network: 'bsquared-testnet',
        chainId: 1123,
        urls: {
          apiURL: 'https://testnet-explorer.bsquared.network/api',
          browserURL: 'https://testnet-explorer.bsquared.network',
        },
      },
      {
        network: 'bitlayer',
        chainId: 200901,
        urls: {
          apiURL: 'https://api.btrscan.com/scan/api',
          browserURL: 'https://www.btrscan.com',
        },
      },
      {
        network: 'bitlayer-testnet',
        chainId: 200810,
        urls: {
          apiURL: 'https://api-testnet.btrscan.com/scan/api',
          browserURL: 'https://testnet.btrscan.com',
        },
      },
      {
        network: 'bevm',
        chainId: 11501,
        urls: {
          apiURL: 'https://scan-mainnet-api.bevm.io/api',
          browserURL: 'https://scan-mainnet.bevm.io',
        },
      },
      {
        network: 'bevm-testnet',
        chainId: 11503,
        urls: {
          apiURL: 'https://scan-testnet-api.bevm.io/api',
          browserURL: 'https://scan-testnet.bevm.io',
        },
      },
      {
        network: 'core',
        chainId: 1116,
        urls: {
          apiURL: 'https://openapi.coredao.org/api',
          browserURL: 'https://scan.coredao.org',
        },
      },
      {
        network: 'core-testnet',
        chainId: 1115,
        urls: {
          apiURL: 'https://scan.test.btcs.network/api',
          browserURL: 'https://scan.test.btcs.network',
        },
      },
      {
        network: 'scroll',
        chainId: 534352,
        urls: {
          apiURL: 'https://api.scrollscan.com/api',
          browserURL: 'https://scrollscan.com',
        },
      },
      {
        network: 'scroll-testnet',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com',
        },
      },
      {
        network: 'bob',
        chainId: 60808,
        urls: {
          apiURL: 'https://explorer.gobob.xyz/api',
          browserURL: 'https://explorer.gobob.xyz',
        },
      },
      {
        network: 'bob-testnet',
        chainId: 111,
        urls: {
          apiURL: 'https://testnet-explorer.gobob.xyz/api',
          browserURL: 'https://testnet-explorer.gobob.xyz',
        },
      },
      {
        network: 'ailayer',
        chainId: 2649,
        urls: {
          apiURL: 'https://mainnet-explorer.ailayer.xyz/api',
          browserURL: 'https://mainnet-explorer.ailayer.xyz',
        },
      },
      {
        network: 'ailayer-testnet',
        chainId: 2648,
        urls: {
          apiURL: 'https://testnet-explorer.ailayer.xyz/api',
          browserURL: 'https://testnet-explorer.ailayer.xyz',
        },
      },
      {
        network: 'mode',
        chainId: 34443,
        urls: {
          apiURL: 'https://explorer.mode.network/api',
          browserURL: 'https://explorer.mode.network',
        },
      },
      {
        network: 'mode-testnet',
        chainId: 919,
        urls: {
          apiURL: 'https://sepolia.explorer.mode.network/api',
          browserURL: 'https://sepolia.explorer.mode.network',
        },
      },
      {
        network: 'zksync',
        chainId: 324,
        urls: {
          apiURL: 'https://api-era.zksync.network/api',
          browserURL: 'https://era.zksync.network',
        },
      },
      {
        network: 'zksync-testnet',
        chainId: 300,
        urls: {
          apiURL: 'https://api-sepolia-era.zksync.network/api',
          browserURL: 'https://sepolia-era.zksync.network',
        },
      },
      {
        network: 'iotex',
        chainId: 4689,
        urls: {
          apiURL: 'https://iotexscout.io/api',
          browserURL: 'https://iotexscan.io',
        },
      },
      {
        network: 'iotex-testnet',
        chainId: 4690,
        urls: {
          apiURL: 'https://testnet.iotexscout.io/api',
          browserURL: 'https://testnet.iotexscan.io',
        },
      },
      {
        network: 'rsk',
        chainId: 30,
        urls: {
          apiURL: 'https://rootstock.blockscout.com/api/',
          browserURL: 'https://rootstock.blockscout.com/',
        },
      },
      {
        network: 'rsk-testnet',
        chainId: 31,
        urls: {
          apiURL: 'https://rootstock-testnet.blockscout.com/api/',
          browserURL: 'https://rootstock-testnet.blockscout.com/',
        },
      },
    ],
  },
};
