import { task } from 'hardhat/config';
import { eNetwork, FORK } from '../../helpers';
import {
  STRATEGY_MANAGER_PROXY_ID,
  STRATEGY_PROXY_ID,
  UNI_IOTX_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-uniiotx-gateway`, `Deploys the UniIOTXGateway contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  await hre.run('compile');

  console.log(`\n- UniIOTXGateway deployment`);

  const network = (FORK ? FORK : hre.network.name) as eNetwork;
  const owner = getParamPerNetwork(Configs.Owner, network);

  // iotex mainnet
  const uniIOTXAddress = '0x236f8c0a61da474db21b693fb2ea7aab0c803894';
  const iotxStakingAddress = '0x2c914ba874d94090ba0e6f56790bb8eb6d4c7e5f';

  const { address: strategyAddress } = await hre.deployments.get(`uniIOTX${STRATEGY_PROXY_ID}`);
  const { address: strategyManagerAddress } = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);

  const { deployer } = await hre.getNamedAccounts();
  const UniIOTXGatewayArtifact = await hre.deployments.deploy(UNI_IOTX_GATEWAY_ID, {
    contract: 'UniIOTXGateway',
    from: deployer,
    args: [uniIOTXAddress, iotxStakingAddress, owner, strategyAddress, strategyManagerAddress],
  });
  console.log(`[Deployment][INFO] UniIOTXGateway deployed ${UniIOTXGatewayArtifact.address}`);
});
