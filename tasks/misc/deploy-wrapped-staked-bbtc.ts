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

    await hre.run('compile');

    console.log(`\n- WrappedStakedBBTCGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);
    const rewardsDuration = getParamPerNetwork(Configs.RewardsDuration, network);
    const operator = getParamPerNetwork(Configs.Operator, network);
    console.log(owner, rewardsDuration, operator);
    if (!owner || !rewardsDuration || !operator) {
      throw '[Deployment][Error] owner or rewardsDuration or operator not config';
    }

    // testnet
    // const lenbPoolAddress = '0xbb11Ed546658a49171D1680Ad014d1A0C140450b';
    // const stBBTCAddress = '0xE3A844a2a9474ac7B5a15cBA4B1a02A83d40d0Ed';

    // mainnet
    const lenbPoolAddress = '0xe8c8819ebCe891Da7Db33a48A2cDca3d72203447';
    const stBBTCAddress = '0x7F150c293c97172C75983BD8ac084c187107eA19';

    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );
    const { address: wrappedStakedBBTCGatewayProxyAddress } = await hre.deployments.get(
      WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID
    );

    const proxyAdmin = await getContract(PROXY_ADMIN_ID);

    const { deployer } = await hre.getNamedAccounts();
    // 1. Deploy WrappedStakedBBTCGateway
    const WrappedStakedBBTCGatewayImplArtifact = await hre.deployments.deploy(
      `Upgradeable-${WRAPPED_STAKED_BBTC_GATEWAY_IMPL_ID}`,
      {
        contract: 'WrappedStakedBBTCGatewayV2',
        from: deployer,
        args: [stBBTCAddress, strategyManagerAddress, delegationManagerAddress],
      }
    );
    console.log(
      `[Deployment][INFO] WrapperStakedBBTCGatewayV2 Impl deployed ${WrappedStakedBBTCGatewayImplArtifact.address}`
    );

    // await waitForTx(
    //   await proxyAdmin.upgrade(
    //     wrappedStakedBBTCGatewayProxyAddress,
    //     (
    //       await hre.deployments.get(`Upgradeable-${WRAPPED_STAKED_BBTC_GATEWAY_IMPL_ID}`)
    //     ).address
    //   )
    // );
    // console.log('WrappedStakedBBTCGateway upgrade successful!');

    // const wrappedStakedBBTCGateway = await hre.ethers.getContractAt(
    //   'WrappedStakedBBTCGatewayV2',
    //   wrappedStakedBBTCGatewayProxyAddress
    // );

    // await waitForTx(await wrappedStakedBBTCGateway.updateLenBPool(lenbPoolAddress));
    // console.log('Config LenB pool successful');
  }
);
