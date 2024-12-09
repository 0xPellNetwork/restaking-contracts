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
  USDX_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-usdx-gateway`, `Deploys the USDXGateway contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  await hre.run('compile');

  console.log(`\n- USDXGateway deployment`);

  const network = (FORK ? FORK : hre.network.name) as eNetwork;
  const owner = getParamPerNetwork(Configs.Owner, network);

  // bsc testnet
  // const usdxAddress = '0x419791890a7F02DD6FCEA028d33bA62C9f3cA276';
  // const usdxMintingAddress = '0x3ce1763850AFb457A9407018aFcc5A87141ec216';

  // bsc mainnet
  const usdxAddress = '0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef';
  const usdxMintingAddress = '0xb45c42Fbf8AF8Df5A1fa080A351E9B2F8e0a56D1';

  const { address: strategyAddress } = await hre.deployments.get(`USDX${STRATEGY_PROXY_ID}`);
  const { address: strategyManagerAddress } = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);

  const { deployer } = await hre.getNamedAccounts();
  const USDXGatewayArtifact = await hre.deployments.deploy(USDX_GATEWAY_ID, {
    contract: 'USDXGateway',
    from: deployer,
    args: [usdxAddress, usdxMintingAddress, owner, strategyAddress, strategyManagerAddress],
  });
  console.log(`[Deployment][INFO] USDXGateway deployed ${USDXGatewayArtifact.address}`);
});
