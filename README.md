# Contracts
Contracts repository has been initialized using `forge init`

## Steps to deploy
1. From the root of the project copy the `.env.exmaple` and fill with valid wallet data.
```bash
cp .env.example .env
```
2. Export envs
```bash
export $(grep -v '^#' .env | xargs)
```
3. Obtain HBARs for fee payments. Visit https://portal.hedera.com/dashboard
4. Navigate to `contracts` directory
```bash
cd contracts 
```
5. Perform a dry run before broadcasting
```bash 
forge create src/MyFirstPythContract.sol:MyFirstPythContract \
--private-key $PRIVATE_KEY \
--rpc-url $RPC_URL \
--constructor-args $PYTH_HEDERA_TESTNET_ADDRESS $HBAR_USD_ID
```
> This command simulates deployment only, without broadcasting.

5. Broadcast the transaction - publish the smart contract
```bash 
forge create src/MyFirstPythContract.sol:MyFirstPythContract \
--private-key $PRIVATE_KEY \
--broadcast \
--rpc-url $RPC_URL \
--constructor-args $PYTH_HEDERA_TESTNET_ADDRESS $HBAR_USD_ID
```
> Watch out that the `--broadcast` flag must be used before the `--constructor-args` to avoid errors!
6. The transaction hash and smart contract data will be returned
```bash
No files changed, compilation skipped
Deployer: 0x481ebA5c63F4D60EBAE282150B308D78746B6734
Deployed to: 0xcdc925C9b29374c323042823Fb569Bc12eD245ea
Transaction hash: 0x0b3c7a81a335c858452f0607e541a385e9e48f488cc06c86341d4b56350cb23e
```