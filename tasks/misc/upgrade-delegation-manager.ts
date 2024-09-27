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

task(`upgrade-delegation-manager`, `Upgrade delegation manager contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    await hre.run('compile');

    console.log(`\n- DelegationManager upgrading`);

    const { deployer } = await hre.getNamedAccounts();
    const network = (FORK ? FORK : hre.network.name) as eNetwork;

    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );
    const { address: slasherAddress } = await hre.deployments.get(SLASHER_PROXY_ID);

    const delegationManagerImplV2 = await hre.deployments.deploy(
      `Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`,
      {
        contract: 'DelegationManagerV2',
        from: deployer,
        args: [strategyManagerAddress, slasherAddress],
      }
    );
    console.log(
      `[Deployment][INFO] DelegationManagerV2 impl deployed ${delegationManagerImplV2.address}`
    );

    // MultiSig

    // const proxyAdmin = await getContract(PROXY_ADMIN_ID);
    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     delegationManagerAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('DelegationManager upgrade successful!');
  }
);