import { task } from 'hardhat/config';
import {
  DelegationManager,
  DelegationManagerV2,
  eNetwork,
  FORK,
  getContract,
  waitForTx,
  WrappedStakedBBTCGateway,
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
  WRAPPED_STAKED_BBTC_GATEWAY_IMPL_ID,
  WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID,
  WRAPPED_TOKEN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';
import { ethers } from 'ethers';

task(`deploy-wrapped-staked-bbtc`, `Deploys the WrappedStakedBBTCGateway contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- WrappedStakedBBTCGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);
    const rewardsDuration = getParamPerNetwork(Configs.RewardsDuration, network);
    const operator = getParamPerNetwork(Configs.Operator, network);
    if (!owner || !rewardsDuration || !operator) {
      throw '[Deployment][Error] owner or rewardsDuration or operator not config';
    }

    const stBBTCAddress = '0xE3A844a2a9474ac7B5a15cBA4B1a02A83d40d0Ed';

    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );
    const { address: proxyAdminAddress } = await hre.deployments.get(PROXY_ADMIN_ID);

    const { deployer } = await hre.getNamedAccounts();
    // 1. Deploy WrappedStakedBBTCGateway
    // const WrappedStakedBBTCGatewayImplArtifact = await hre.deployments.deploy(
    //   WRAPPED_STAKED_BBTC_GATEWAY_IMPL_ID,
    //   {
    //     contract: 'WrappedStakedBBTCGateway',
    //     from: deployer,
    //     args: [stBBTCAddress, strategyManagerAddress, delegationManagerAddress],
    //   }
    // );
    // console.log(
    //   `[Deployment][INFO] WrapperStakedBBTCGateway Impl deployed ${WrappedStakedBBTCGatewayImplArtifact.address}`
    // );
    // const ifaceStrategy = new ethers.utils.Interface(WrappedStakedBBTCGatewayImplArtifact.abi);
    // const WrappedStakedBBTCGatewayProxyArtifact = await hre.deployments.deploy(
    //   WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID,
    //   {
    //     from: deployer,
    //     contract: 'TransparentUpgradeableProxy',
    //     args: [
    //       WrappedStakedBBTCGatewayImplArtifact.address,
    //       proxyAdminAddress,
    //       ifaceStrategy.encodeFunctionData('initialize', [deployer, rewardsDuration]),
    //     ],
    //   }
    // );
    // console.log(
    //   `[Deployment][INFO] WrapperStakedBBTCGateway Proxy deployed ${WrappedStakedBBTCGatewayProxyArtifact.address}`
    // );

    // // 2. Config operator
    const { address: wrappedStakedBBTCGatewayProxyAddress } = await hre.deployments.get(
      WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID
    );
    const wrappedStakedBBTCGatewayInstance = await hre.ethers.getContractAt(
      'WrappedStakedBBTCGateway',
      wrappedStakedBBTCGatewayProxyAddress
    );
    // console.log(await wrappedStakedBBTCGatewayInstance.owner());

    // await waitForTx(await wrappedStakedBBTCGatewayInstance.addOperator(operator));
    // console.log('WrappedStakedBBTCGateway operator config successful');

    // // 3. Deploy upgradeable StrategyManagerV2 & DelegationManagerV2
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

    // 4. Add strategy

    // 5. Config WrappedStakedBBTCGateway strategy address
    // await waitForTx(
    //   await wrappedStakedBBTCGatewayInstance.setStrategy(
    //     '0x87e7b0a40f5ead26bd2336E2a2c8F02975667fDC'
    //   )
    // );
    // console.log('WrappedStakedBBTCGateway strategy config successful');
    // // 6. Transfer ownership
    // await waitForTx(await wrappedStakedBBTCGatewayInstance.transferOwnership(owner));
    // console.log(
    //   `WrappedStakedBBTCGateway transfer ownership successful ${await wrappedStakedBBTCGatewayInstance.owner()}`
    // );

    // 7. Upgrade StrategyManager & DelegationManager
    // const proxyAdmin = await getContract(PROXY_ADMIN_ID);
    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     strategyManagerAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${STRATEGY_MANAGER_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('Strategy upgrade successful');
    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     delegationManagerAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('Delegation upgrade successful');

    // // 8. Update DelegationManager WrappedTokenGateway address
    // const delegationManagerInstance = await hre.ethers.getContractAt(
    //   'DelegationManagerV2',
    //   delegationManagerAddress
    // );
    // await waitForTx(
    //   await delegationManagerInstance.updateWrappedTokenGateway(
    //     (
    //       await hre.deployments.get(WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID)
    //     ).address
    //   )
    // );
    // console.log('WrappedTokenGateway update successful');
  }
);
