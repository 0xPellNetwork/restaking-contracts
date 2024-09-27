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
  ZETA_CHAIN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-zetachain-gateway`, `Deploys the ZetaChainGateway contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    await hre.run('compile');

    console.log(`\n- ZetaChainGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);

    // zetachain testnet
    const zetachainSystemContractAddress = '0xEdf1c3275d13489aCdC6cD6eD246E72458B8795B';
    const bitcoinZRC20Address = '0x65a45c57636f9BcCeD4fe193A602008578BcA90b';
    // zetachain mainnet
    // const zetachainSystemContractAddress = "0x91d18e54DAf4F677cB28167158d6dd21F6aB3921";
    // const bitcoinZRC20Address = '0x13A0c5930C028511Dc02665E7285134B6d11A5f4';

    const { address: strategyAddress } = await hre.deployments.get(`BTC.BTC${STRATEGY_PROXY_ID}`);
    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );

    const { deployer } = await hre.getNamedAccounts();
    const zetachainGateway = await hre.deployments.deploy(ZETA_CHAIN_GATEWAY_ID, {
      contract: 'ZetaChainGateway',
      from: deployer,
      args: [
        zetachainSystemContractAddress,
        bitcoinZRC20Address,
        owner,
        strategyAddress,
        strategyManagerAddress,
        delegationManagerAddress,
      ],
    });
    console.log(`[Deployment][INFO] ZetaChainGateway deployed ${zetachainGateway.address}`);

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

    await waitForTx(
      await proxyAdmin.upgrade(
        delegationManagerAddress,
        (
          await hre.deployments.get(`Upgradeable-${DELEGATION_MANAGER_IMPL_ID}`)
        ).address
      )
    );
    console.log('DelegationManager upgrade successful!');

    const delegationManager = await hre.ethers.getContractAt(
      'DelegationManagerV2',
      delegationManagerAddress
    );

    await waitForTx(await delegationManager.updateWrappedTokenGateway(zetachainGateway.address));
    console.log('Config ZetaChainGateway successful');
  }
);
