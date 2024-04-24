import { parseEther, parseUnits } from 'ethers/lib/utils';
import { eArbitrumNetwork, eBaseNetwork, eEthereumNetwork } from './types';

export const oneEther = parseEther('1');
export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ONE_ADDRESS = '0x0000000000000000000000000000000000000001';
export const ONE_YEAR = 31536000;
export const ONE_MONTH = 2592000;
export const ONE_WEEK = 604800;
export const ONE_DAY = 86400;
export const ONE_HOUR = 3600;

export const WRAPPED_NATIVE_TOKEN_PER_NETWORK: { [network: string]: string } = {
  [eEthereumNetwork.sepolia]: '0x6209f6CADe90416BecaAA48Ca693D2652ecc36D9',
  [eEthereumNetwork.goerli]: '0x6Cc53D3AeaEe7aAfbd2Ac304AA64d017E6cb4f2a',
  [eEthereumNetwork.main]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [eArbitrumNetwork.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [eArbitrumNetwork.arbitrumSepolia]: '0x4e161d400612514046eF9BC78692843bcec81C91',
  [eBaseNetwork.base]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [eBaseNetwork.baseGoerli]: '0x4e161d400612514046eF9BC78692843bcec81C91',
};

export const ZERO_BYTES_32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const EMPTY_STORAGE_SLOT =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const DEFAULT_NAMED_ACCOUNTS = {
  deployer: {
    default: 0,
  },
};
