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

    console.log(`\n- WrappedTokenGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);

    const wrappedTokenAddress = '0x559852401e545f941F275B5674afAfcb1b51D147';

    const { address: strategyAddress } = await hre.deployments.get(`WBTC${STRATEGY_PROXY_ID}`);
    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );

    const { deployer } = await hre.getNamedAccounts();
    await hre.deployments.deploy(WRAPPED_TOKEN_GATEWAY_ID, {
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
    console.log(`[Deployment][INFO] WrapperTokenGateway deployed`);

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

    // MultiSig call DelegationManagerProxy updateWrappedTokenGateway
  }
);
