import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import { eNetwork, sleepTx } from '../../helpers';
import {
  DELEGATION_MANAGER_PROXY_ID,
  EMPTY_CONTRANCT_ID,
  PROXY_ADMIN_ID,
  SLASHER_PROXY_ID,
  STRATEGY_IMPL_ID,
  STRATEGY_MANAGER_PROXY_ID,
} from '../../helpers/deploy-ids';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const StrategyManagerProxyArtifact = await deployments.get(STRATEGY_MANAGER_PROXY_ID);

  await deploy(STRATEGY_IMPL_ID, {
    from: deployer,
    contract: 'StrategyBaseTVLLimits',
    args: [StrategyManagerProxyArtifact.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  await sleepTx(5000);

  return true;
};

func.id = 'StrategyImpl';
func.tags = ['strategy'];

export default func;
