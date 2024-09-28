# Pell Core Operations Scripts

This repository contains Hardhat scripts to interact with staking and delegation smart contracts. You can use these scripts to stake asset into strategies and delegate shares to operators on supported networks.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
   - [Staking](#staking)
   - [Delegation](#delegation)
5. [Additional Notes](#additional-notes)

## Prerequisites

Before using these scripts, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [Git](https://git-scm.com/) for cloning the repository
- A valid mnemonic or private key to use for interacting with the blockchain
- A configured `.env` file to securely store the mnemonic

## Installation

1. **Clone the Repository**

   Clone the repository to your local environment:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**

   Install the required dependencies using `npm`:

   ```bash
   npm install
   ```

   This will install all the necessary packages, including Hardhat and Ethers.js.

3. **Compile the Contracts**

   Before running any script, make sure to compile the contracts:

   ```bash
   npx hardhat compile
   ```

## Configuration

1. **Set Up Environment Variables**

   Create a `.env` file at the root of the project to store your mnemonic for secure access. Use the following format:

   ```env
   ACCOUNT_SECRETKEY="your private key"
   ```

   Make sure this file is secure and not shared publicly.

2. **Configure Networks**

   These scripts support multiple networks, including bitlayer, merlin, bsc, bsquared, and more. Make sure your .env file is correctly set up and funded with the appropriate tokens for these networks.

## Usage

Each script is invoked using `npx hardhat` with the appropriate command and parameters. Below are the detailed usage instructions for each operation, along with explanations of the parameters.

### Staking

To stake collateral into a specific strategy, run the following command:

```bash
npx hardhat op-stake --asset <asset-address> --amount <asset-amount> --network <network>
```

- **`--asset`**: The address of the asset (ERC20 token) you are staking. For example: `0x7C346C27Ef3A48B1AE0454D994A49005C720D6FA`.
- **`--amount`**: The amount of the asset to stake. **Note**: The script automatically handles token decimals and converts the `amount` to the appropriate precision.
- **`--network`**: The network to execute the transaction on. Supported networks include bitlayer, merlin, bsc, bsquared, and more.

**Staking Process Overview**:

1. The staker initiates the staking process by specifying the asset and the amount to stake.
2. The asset is approved for the `StrategyManager` contract.
3. The staked asset is deposited into the chosen strategy.
4. The staker receives strategy shares representing their stake, which can later be used for delegation.

Example:

```bash
npx hardhat op-stake --asset 0x7C346C27Ef3A48B1AE0454D994A49005C720D6FA --amount 100 --network bsc-testnet
```

### Delegation

To delegate your staked shares to an operator, run the following command:

```bash
npx hardhat op-delegate --operator <operator-address> --network <network>
```

- **`--operator`**: The address of the operator to whom you are delegating your staked shares.
- **`--network`**: The network to execute the transaction on. Supported networks include bitlayer, merlin, bsc, bsquared, and more.

**Delegation Process Overview**:

1. After staking, the staker can delegate their shares to a specific operator.
2. The delegation is executed through the `DelegationManager` contract, which registers the operator to manage the staked shares.
3. The operator is assigned the delegated shares, which can be used for governance or other purposes defined by the protocol.

Example:

```bash
npx hardhat op-delegate --operator 0x1234567890abcdef --network bsc-testnet
```

## Additional Notes

- **Network Fees**: Ensure your wallet has enough native tokens to cover transaction fees.
- **Staker Shares**: After staking, you can check the staker's strategy shares using the `StrategyManager` contract.
- **Operator Shares**: After delegating, the operator's delegated shares can be queried from the `DelegationManager` contract.

---

This guide provides step-by-step instructions on how to use the staking and delegation scripts. If you encounter any issues or have further questions, please refer to the repository’s documentation or contact the project maintainers.
