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
  UNI_BTC_GATEWAY_ID,
  WRAPPED_TOKEN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`deploy-unibtc-gateway`, `Deploys the UniBTCGateway contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  await hre.run('compile');

  console.log(`\n- UniBTCGateway deployment`);

  const network = (FORK ? FORK : hre.network.name) as eNetwork;
  const owner = getParamPerNetwork(Configs.Owner, network);

  // bsquared testnet
  // const uniBTCAddress = '0x2A41E6cBEcd491BcAc8EBEc766F696c6868dF5Bb';
  // const uniBTCVaultAddress = '0x7b502746df19d64Cd824Ca0224287d06bae31DA3';

  // mainnet
  const uniBTCAddress = '0x93919784C523f39CACaa98Ee0a9d96c3F32b593e';
  const uniBTCVaultAddress = '0xF9775085d726E782E83585033B58606f7731AB18';

  const { address: strategyAddress } = await hre.deployments.get(`uniBTC${STRATEGY_PROXY_ID}`);
  const { address: strategyManagerAddress } = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);

  const { deployer } = await hre.getNamedAccounts();
  const UniBTCGatewayArtifact = await hre.deployments.deploy(UNI_BTC_GATEWAY_ID, {
    contract: 'UniBTCGateway',
    from: deployer,
    args: [uniBTCAddress, uniBTCVaultAddress, owner, strategyAddress, strategyManagerAddress],
  });
  console.log(`[Deployment][INFO] UniBTCGateway deployed ${UniBTCGatewayArtifact.address}`);
});
