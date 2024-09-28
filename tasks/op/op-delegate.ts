import { BigNumberish } from 'ethers';
import { BytesLike } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { DELEGATION_MANAGER_PROXY_ID } from '../../helpers/deploy-ids';
import { waitForTx } from '../../helpers';

task(`op-delegate`, `Delegation manager delegate`)
  .addParam('operator', 'Operator address')
  .setAction(async ({ operator }, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log('-----DelegationManager Delegate----');

    const { staker } = await hre.getNamedAccounts();
    const singer = await hre.ethers.getSigner(staker);

    const { address: delegationManagerAddress } = await hre.deployments.get(
      DELEGATION_MANAGER_PROXY_ID
    );
    const delegationManagerInstance = await hre.ethers.getContractAt(
      'DelegationManager',
      delegationManagerAddress,
      singer
    );

    const signatureParams: {
      signature: BytesLike;
      expiry: BigNumberish;
    } = {
      signature: '0x',
      expiry: 0,
    };
    const approverSalt = '0x0000000000000000000000000000000000000000000000000000000000000000';
    // Delegate
    await waitForTx(
      await delegationManagerInstance.delegateTo(operator, signatureParams, approverSalt)
    );

    // Check operator delegated shares
    console.log(`[LOG] Delegate to operator: ${operator} successful!`);
  });
