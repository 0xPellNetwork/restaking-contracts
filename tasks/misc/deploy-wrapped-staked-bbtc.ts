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
  WRAPPED_STAKED_BBTC_GATEWAY_ID,
  WRAPPED_TOKEN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-wrapped-staked-bbtc`, `Deploys the WrappedStakedBBTCGateway contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- WrappedStakedBBTCGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);

    const stBBTCAddress = '0xE3A844a2a9474ac7B5a15cBA4B1a02A83d40d0Ed';

    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );

    const { deployer } = await hre.getNamedAccounts();
    // const wrappedStakedBBTCGateway = await hre.deployments.deploy(WRAPPED_STAKED_BBTC_GATEWAY_ID, {
    //   contract: 'WrappedStakedBBTCGateway',
    //   from: deployer,
    //   args: [stBBTCAddress, owner, strategyManagerAddress, delegationManagerAddress],
    // });
    // console.log(
    //   `[Deployment][INFO] WrapperStakedBBTCGateway deployed ${wrappedStakedBBTCGateway.address}`
    // );

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

    // MultiSig call DelegationManagerProxy updateWrappedTokenGateway

    // Upgrade
    const proxyAdmin = await getContract(PROXY_ADMIN_ID);
    await waitForTx(
      await proxyAdmin.upgrade(strategyManagerAddress, '0x3dD23e12c6285495596c68360f28e9E681E9D22F')
    );
    console.log('Strategy upgrade successful');
    await waitForTx(
      await proxyAdmin.upgrade(
        delegationManagerAddress,
        '0xF77033Df400f570Eb931A4E68fcC71C9B8895F82'
      )
    );
    console.log('Delegation upgrade successful');

    // Update DelegationManager WrappedTokenGateway
    const delegationManagerInstance = await hre.ethers.getContractAt(
      'DelegationManagerV2',
      delegationManagerAddress
    );
    await waitForTx(
      await delegationManagerInstance.updateWrappedTokenGateway(
        '0xdcaC27eb1209e6A8C3Db75e43912923BEacE3A2B'
      )
    );
    console.log('WrappedTokenGateway update successful');

    const wrappedStakedBBTCGatewayInstance = (await getContract(
      WRAPPED_STAKED_BBTC_GATEWAY_ID
    )) as WrappedStakedBBTCGateway;
    await waitForTx(
      await wrappedStakedBBTCGatewayInstance.setStrategy(
        '0xe7228BbAB4B4eE1353DA05b2340cFc779D3E1756'
      )
    );
    console.log('WrappedStakedBBTCGateway strategy config successful');
  }
);
