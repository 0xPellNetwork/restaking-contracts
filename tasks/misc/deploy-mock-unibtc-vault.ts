import { task } from 'hardhat/config';
import { eNetwork, FORK, getContract, UniBTCVault, waitForTx } from '../../helpers';
import { parseUnits } from 'ethers/lib/utils';

task(`deploy-mock-unibtc-vault`, `Deploys the mock UniBTCVault contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    await hre.run('compile');

    console.log(`\n- MockUniBTCVault deployment`);

    // testnet
    const uniBTCAddress = '0x419791890a7F02DD6FCEA028d33bA62C9f3cA276';

    const { deployer } = await hre.getNamedAccounts();
    const UniBTCVaultArtifact = await hre.deployments.deploy('MockUniBTCVault', {
      contract: 'UniBTCVault',
      from: deployer,
      args: [uniBTCAddress],
    });
    console.log(`[Deployment][INFO] UniBTCVault deployed ${UniBTCVaultArtifact.address}`);

    const uniBTCVault = (await getContract('MockUniBTCVault')) as UniBTCVault;

    const naviveBTC = '0x7C346C27Ef3A48B1AE0454D994A49005C720D6FA';
    await waitForTx(await uniBTCVault.setCap(naviveBTC, parseUnits('5000', 18)));
    const naviveBTC1 = '0xF9173645D5A391d9Fb29Fc3438024499E3AC5eD0';
    await waitForTx(await uniBTCVault.setCap(naviveBTC1, parseUnits('5000', 18)));
  }
);
