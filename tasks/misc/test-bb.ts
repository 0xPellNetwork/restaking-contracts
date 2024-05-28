import { task } from 'hardhat/config';
import {
  DelegationManager,
  DelegationManagerV2,
  eNetwork,
  FORK,
  getContract,
  waitForTx,
  WrappedStakedBBTCGateway,
  WrappedTokenGateway,
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
  WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID,
  WRAPPED_TOKEN_GATEWAY_ID,
} from '../../helpers/deploy-ids';
import { Configs } from '../../helpers/config';
import { getParamPerNetwork } from '../../helpers/config-helpers';

task(`test-bb`, `Deploys the WrappedTokenGateway contract`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  const StrategyManagerProxyArtifact = await hre.deployments.get(STRATEGY_MANAGER_PROXY_ID);
  const strategyManagerInstance = await hre.ethers.getContractAt(
    'StrategyManager',
    StrategyManagerProxyArtifact.address
  );
  const DelegationManagerProxyArtifact = await hre.deployments.get(DELEGATION_MANAGER_PROXY_ID);
  const delegationManagerInstance = await hre.ethers.getContractAt(
    'DelegationManager',
    DelegationManagerProxyArtifact.address
  );
  const StrategyProxyArtifact = await hre.deployments.get(`wstBBTC${STRATEGY_PROXY_ID}`);
  const strategyInstance = await hre.ethers.getContractAt(
    'StrategyBaseTVLLimits',
    StrategyProxyArtifact.address
  );

  // const aMUSDT = await hre.ethers.getContractAt(
  //   'ERC20',
  //   '0x2cb2C80e66eD830C52e5a7dd7ef399e89893C385'
  // );
  // console.log('totalBalance: ', await aMUSDT.balanceOf(StrategyProxyArtifact.address));
  // console.log('totalShares: ', await strategyInstance.totalShares());
  // console.log(
  //   'userUnderlying: ',
  //   await strategyInstance.userUnderlyingView('0x1Ee532cf775be02E0B306571e3555321FC75988d')
  // );
  // console.log(
  //   'userShares: ',
  //   await strategyInstance.shares('0x1Ee532cf775be02E0B306571e3555321FC75988d')
  // );
  // console.log(
  //   await strategyManagerInstance.stakerStrategyShares(
  //     '0x1Ee532cf775be02E0B306571e3555321FC75988d',
  //     strategyInstance.address
  //   )
  // );

  console.log(await strategyManagerInstance.strategyWhitelister());
  console.log(await delegationManagerInstance.owner());
  console.log(await strategyInstance.pauserRegistry());
  console.log(await strategyInstance.getTVLLimits());
  // console.log(StrategyProxyArtifact.address);
  // console.log(await strategyInstance.totalShares());

  // await strategyManagerInstance.addStrategiesToDepositWhitelist(
  //   [StrategyProxyArtifact.address],
  //   [false]
  // );
  // await delegationManagerInstance.setStrategyWithdrawalDelay(
  //   [StrategyProxyArtifact.address],
  //   [180]
  // );
  // return;

  // const wrappedTokenGateway = (await getContract(WRAPPED_TOKEN_GATEWAY_ID)) as WrappedTokenGateway;
  // const proxyAdmin = await getContract(PROXY_ADMIN_ID);
  // console.log(await proxyAdmin.owner());
  // console.log(await wrappedTokenGateway.owner());
  // console.log(await wrappedTokenGateway.getStrategyAddress());
  // console.log(await wrappedTokenGateway.getWrappedTokenAddress());

  const { address: wrappedStakedBBTCGatewayProxyAddress } = await hre.deployments.get(
    WRAPPED_STAKED_BBTC_GATEWAY_PROXY_ID
  );
  const wrappedStakedBBTCGateway = await hre.ethers.getContractAt(
    'WrappedStakedBBTCGateway',
    wrappedStakedBBTCGatewayProxyAddress
  );
  console.log(await wrappedStakedBBTCGateway.owner());
  console.log(await wrappedStakedBBTCGateway.getStrategyAddress());
  console.log(await wrappedStakedBBTCGateway.getStakedBBTCAddress());
  console.log(
    await wrappedStakedBBTCGateway.allowance(
      wrappedStakedBBTCGateway.address,
      strategyManagerInstance.address
    )
  );
});
