# hedera-pyth-oracle-example

A full-stack Web3 application demonstrating how to integrate Pyth Network price feeds with Hedera smart contracts. This
monorepo showcases fetching real-time price data from Pyth oracles and posting it on-chain using a React frontend.
## Project Structure
This repository uses pnpm workspaces to manage two interconnected projects:

- `./contracts` - Foundry-based smart contracts for Hedera testnet
- `./apps/frontend` - Vite + React frontend with wallet integration

For workspace management details, see the [pnpm workspace documentation](https://pnpm.io/workspaces).

## Prerequisites
- **Node.js** (v23.3)
- **pnpm** package manager
- **Foundry** for smart contract development
- **Hedera Testnet Account**

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd hedera-pyth-oracle-example
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your wallet details and API keys
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Navigate to** `http://localhost:5173/` and start interacting with the dApp!


## Smart Contracts

The `./contracts` directory contains a Foundry project with two smart contracts:

- **`MyFirstPythContract.sol`** - Tutorial implementation from [Pyth Network docs](https://docs.pyth.network/price-feeds/create-your-first-pyth-app/evm/part-1)
- **`PythPriceConsumer.sol`** - Production-ready contract powering the frontend dApp

### Environment Setup

1. **Copy and configure environment:**
   ```bash
   cp .env.example .env
   ```

2. **Required environment variables:**
   ```env
   PRIVATE_KEY=your_wallet_private_key
   RPC_URL=https://testnet.hashio.io/api
   PYTH_HEDERA_TESTNET_ADDRESS=0x...
   HBAR_USD_ID=0x...
   ```

3. **Export environment variables:**
   ```bash
   export $(grep -v '^#' .env | xargs)
   ```

### Get Testnet HBAR

Visit the [Hedera Portal](https://portal.hedera.com/dashboard) to fund your testnet account.

### Deploy Smart Contract

1. **Navigate to contracts directory:**
   ```bash
   cd contracts
   ```

2. **Test deployment (dry run):**
   ```bash
   forge create src/PythPriceConsumer.sol:PythPriceConsumer \
     --private-key $PRIVATE_KEY \
     --rpc-url $RPC_URL \
     --constructor-args $PYTH_HEDERA_TESTNET_ADDRESS $HBAR_USD_ID
   ```

3. **Deploy to testnet:**
   ```bash
   forge create src/PythPriceConsumer.sol:PythPriceConsumer \
     --private-key $PRIVATE_KEY \
     --broadcast \
     --rpc-url $RPC_URL \
     --constructor-args $PYTH_HEDERA_TESTNET_ADDRESS $HBAR_USD_ID
   ```

   **⚠️ Important:** The `--broadcast` flag must come before `--constructor-args` to avoid errors.

4. **Save deployment info:**
   ```bash
   # Example output:
   Deployer: 0x481ebA5c63F4D60EBAE282150B308D78746B6734
   Deployed to: 0xcdc925C9b29374c323042823Fb569Bc12eD245ea
   Transaction hash: 0x0b3c7a81a335c858452f0607e541a385e9e48f488cc06c86341d4b56350cb23e
   ```


A React application built with:
- **Vite** for fast development and building
- **shadcn/ui** for clean, accessible components
- **Reown AppKit** for seamless wallet connections
- **TypeScript** for type safety

### Environment Configuration

Create or update your `.env` file with:

```env
# Reown (formerly WalletConnect) Project ID
VITE_REOWN_PROJECT_ID=your_reown_project_id

# Smart contract address (use provided or deploy your own)
VITE_CONTRACT_ADDRESS=0xcdc925C9b29374c323042823Fb569Bc12eD245ea

# Pyth price feed configuration (use the provided)
HBAR_USD_ID=0x3728e591097635310e6341af53db8b7ee42da9b3a8d918f9463ce9cca886dfbd
```

**Getting your Reown Project ID:**
1. Visit [Reown Cloud](https://reown.com/cloud)
2. Create a new project
3. Copy the Project ID

### Running the Application

From the project root:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173/`

## How to Use the dApp

### Step 1: Connect Your Wallet
Click the wallet connection button at the top of the page. Supported wallets include MetaMask, WalletConnect-compatible wallets, and others.

### Step 2: Fetch Price Data
1. Select a token pair (currently supports `HBAR/USDC`)
2. Click **"Fetch price"** to get real-time data from Pyth Network
3. The current price will be displayed

### Step 3: Post Price On-Chain
1. Click **"Post price"** in the price display card
2. Confirm the transaction in your wallet
3. Wait for transaction confirmation

### Step 4: Verify On-Chain Data
Click **"Fetch on-chain price"** to read the latest price stored in your smart contract.

## Using a Custom Smart Contract

To use your own deployed contract:

1. **Update contract address:**
   ```bash
   # In your .env file
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

2. **Update contract ABI:**
   ```bash
   # Replace the ABI in:
   ./apps/frontend/src/assets/abi.json
   ```

3. **Generate new ABI (if needed):**
   ```bash
   cd contracts
   forge build
   # Copy ABI from out/PythPriceConsumer.sol/PythPriceConsumer.json
   ```

## ⚠️ Disclaimer
This is example code for educational purposes. Always audit smart contracts before deploying to mainnet and never share your private keys.