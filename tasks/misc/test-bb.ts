import { task } from 'hardhat/config';
import {
  DelegationManager,
  DelegationManagerV2,
  eNetwork,
  FORK,
  getContract,
  waitForTx,
  ZERO_ADDRESS,
} from '../../helpers';
import {
  DELEGATION_MANAGER_IMPL_ID,
  DELEGATION_MANAGER_PROXY_ID,
  PROXY_ADMIN_ID,
  SLASHER_PROXY_ID,
  STRATEGY_MANAGER_IMPL_ID,
  STRATEGY_MANAGER_PROXY_ID,
  STRATEGY_PROXY_ID,
  WRAPPED_TOKEN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`test-bb`, `Deploys the WrappedTokenGateway contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  const StrategyManagerProxyArtifact = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);
  const strategyManagerInstance = await hre.ethers.getContractAt(
    'StrategyManagerV2',
    StrategyManagerProxyArtifact.address
  );
  const DelegationManagerProxyArtifact = await hre.deployments.get(DELEGATION_MANAGER_PROXY_ID);
  const degationManagerInstance = await hre.ethers.getContractAt(
    'DelegationManagerV2',
    DelegationManagerProxyArtifact.address
  );
});
