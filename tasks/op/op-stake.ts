import { parseUnits } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { MAX_UINT_AMOUNT, waitForTx } from '../../helpers';
import { STRATEGY_MANAGER_PROXY_ID, STRATEGY_PROXY_ID } from '../../helpers/deploy-ids';

task(`op-stake`, `StrategyManager stake`)
  .addParam('asset', 'Collateral asset')
  .addParam('amount', 'Collateral amount')
  .setAction(async ({ asset, amount }, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log('----StategyManager Stake----');

    const { staker } = await hre.getNamedAccounts();
    const signer = await hre.ethers.getSigner(staker);

    const { address: strategyManagerAddress } = await hre.deployments.get(
      STRATEGY_MANAGER_PROXY_ID
    );
    const strategyManagerInstance = await hre.ethers.getContractAt(
      'StrategyManager',
      strategyManagerAddress,
      signer
    );

    const ERC20 = await hre.ethers.getContractAt('ERC20', asset);
    const assetDecimals = await ERC20.decimals();
    const assetSymbol = await ERC20.symbol();

    // Parse the usdx amount to the appropriate decimals
    const stakeAmount = parseUnits(amount, assetDecimals);

    const allowance = await ERC20.allowance(signer.address, strategyManagerAddress);
    if (allowance < stakeAmount) {
      await waitForTx(await ERC20.connect(signer).approve(strategyManagerAddress, MAX_UINT_AMOUNT));
      console.log(
        `[OP][Stake] Successfully approve with asset ${ERC20.address} to spender ${strategyManagerAddress}`
      );
    }

    const { address: strategyAddress } = await hre.deployments.get(
      `${assetSymbol}${STRATEGY_PROXY_ID}`
    );

    // Stake
    await waitForTx(
      await strategyManagerInstance.depositIntoStrategy(strategyAddress, ERC20.address, stakeAmount)
    );

    // Check staker shares
    console.log(
      `[LOG] Staker: ${staker} shares: ${await strategyManagerInstance.stakerStrategyShares(
        staker,
        strategyAddress
      )}`
    );
  });
