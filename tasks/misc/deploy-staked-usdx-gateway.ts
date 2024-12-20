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
  STAKED_USDX_GATEWAY_ID,
  STRATEGY_MANAGER_IMPL_ID,
  STRATEGY_MANAGER_PROXY_ID,
  STRATEGY_PROXY_ID,
  USDX_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-staked-usdx-gateway`, `Deploys the StakedUSDXGateway contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    await hre.run('compile');

    console.log(`\n- USDXGateway deployment`);

    const network = (FORK ? FORK : hre.network.name) as eNetwork;
    const owner = getParamPerNetwork(Configs.Owner, network);

    // bsc testnet
    // const usdxAddress = '0x419791890a7F02DD6FCEA028d33bA62C9f3cA276';
    // const sUsdxAddress = '0x559852401e545f941F275B5674afAfcb1b51D147';
    // const usdxMintingAddress = '0x3ce1763850AFb457A9407018aFcc5A87141ec216';

    // bsc mainnet
    const usdxAddress = '0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef';
    const sUsdxAddress = '0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92';
    const usdxMintingAddress = '0xb45c42Fbf8AF8Df5A1fa080A351E9B2F8e0a56D1';

    const { address: strategyAddress } = await hre.deployments.get(`sUSDX${STRATEGY_PROXY_ID}`);
    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );

    const { deployer } = await hre.getNamedAccounts();
    const USDXGatewayArtifact = await hre.deployments.deploy(STAKED_USDX_GATEWAY_ID, {
      contract: 'StakedUSDXGateway',
      from: deployer,
      args: [
        usdxAddress,
        sUsdxAddress,
        usdxMintingAddress,
        owner,
        strategyAddress,
        strategyManagerAddress,
      ],
    });
    console.log(`[Deployment][INFO] StakedUSDXGateway deployed ${USDXGatewayArtifact.address}`);
  }
);
