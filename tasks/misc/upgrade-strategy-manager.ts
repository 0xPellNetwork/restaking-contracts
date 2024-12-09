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

task(`upgrade-strategy-manager`, `Upgrade strategy manager contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  await hre.run('compile');

  console.log(`\n- StrategyManager upgrading`);

  const { deployer } = await hre.getNamedAccounts();
  const network = (FORK ? FORK : hre.network.name) as eNetwork;

  const { address: strategyManagerAddress } = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);
  const { address: delegationManagerAddress } = await hre.deployments.get(
    DELEGATION_MANAGER_PROXY_ID
  );
  const { address: slasherAddress } = await hre.deployments.get(SLASHER_PROXY_ID);

  const strategyManagerImplV2 = await hre.deployments.deploy(
    `Upgradeable-${STRATEGY_MANAGER_IMPL_ID}`,
    {
      contract: 'StrategyManagerV2',
      from: deployer,
      args: [delegationManagerAddress, slasherAddress],
    }
  );
  console.log(
    `[Deployment][INFO] StrategyManagerV2 impl deployed ${strategyManagerImplV2.address}`
  );

  // MultiSig

  const proxyAdmin = await getContract(PROXY_ADMIN_ID);
  await waitForTx(
    await proxyAdmin.upgrade(
      strategyManagerAddress,
      (
        await hre.deployments.get(`Upgradeable-${STRATEGY_MANAGER_IMPL_ID}`)
      ).address
    )
  );
  console.log('StrategyManager upgrade successful!');
});
