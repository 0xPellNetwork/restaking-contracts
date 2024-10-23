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

task(`deploy-wrapped-gateway`, `Deploys the WrappedTokenGateway contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    await hre.run('compile');

    console.log(`\n- WrappedTokenGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);

    const wrappedTokenAddress = '0x542fda317318ebf1d3deaf76e0b632741a7e677d';

    const { address: strategyAddress } = await hre.deployments.get(`WRBTC${STRATEGY_PROXY_ID}`);
    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );

    const { deployer } = await hre.getNamedAccounts();
    const wrappedTokenGateway = await hre.deployments.deploy(WRAPPED_TOKEN_GATEWAY_ID, {
      contract: 'WrappedTokenGateway',
      from: deployer,
      args: [
        wrappedTokenAddress,
        owner,
        strategyAddress,
        strategyManagerAddress,
        delegationManagerAddress,
      ],
    });
    console.log(`[Deployment][INFO] WrapperTokenGateway deployed ${wrappedTokenGateway.address}`);

    // const { address: slasherAddress } = await hre.deployments.get(SLASHER_PROXY_ID);
    // const strategyManagerImplV2 = await hre.deployments.deploy(
    //   `Upgradeable-${STRATEGY_MANAGER_IMPL_ID}`,
    //   {
    //     contract: 'StrategyManagerV2',
    //     from: deployer,
    //     args: [delegationManagerAddress, slasherAddress],
    //   }
    // );
    // console.log(
    //   `[Deployment][INFO] StrategyManagerV2 impl deployed ${strategyManagerImplV2.address}`
    // );

    // const delegationManagerImplV2 = await hre.deployments.deploy(
    //   `Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`,
    //   {
    //     contract: 'DelegationManagerV2',
    //     from: deployer,
    //     args: [strategyManagerAddress, slasherAddress],
    //   }
    // );
    // console.log(
    //   `[Deployment][INFO] DelegationManagerV2 impl deployed ${delegationManagerImplV2.address}`
    // );

    // // MultiSig call DelegationManagerProxy updateWrappedTokenGateway

    // const proxyAdmin = await getContract(PROXY_ADMIN_ID);
    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     strategyManagerAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${STRATEGY_MANAGER_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('StrategyManager upgrade successful!');

    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     delegationManagerAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('DelegationManager upgrade successful!');

    // const delegationManager = await hre.ethers.getContractAt(
    //   'DelegationManagerV2',
    //   delegationManagerAddress
    // );

    // await waitForTx(await delegationManager.updateWrappedTokenGateway(wrappedTokenGateway.address));
    // console.log('Config WrappedTokenGateway successful');
  }
);
