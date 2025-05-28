# Contracts
Contracts repository has been initialized using `forge init`

## Steps to deploy
1. From the root of the project copy the `.env.exmaple` and fill with valid wallet data.
```bash
cp .env.example .env
```
2. Export envs
```bash
export $(cat .env | xargs) 
```
3. Obtain HBARs for fee payments. Visit https://portal.hedera.com/dashboard
4. Perform a dry run before broadcasting
```bash 
forge create src/MyFirstPythContract.sol:MyFirstPythContract \
--private-key $PRIVATE_KEY \
--rpc-url $RPC_URL \
--constructor-args $PYTH_OP_SEPOLIA_ADDRESS $ETH_USD_ID
```
5. Broadcast the transaction - publish the smart contract
```bash 
forge create src/MyFirstPythContract.sol:MyFirstPythContract \
--private-key $PRIVATE_KEY \
--broadcast \
--rpc-url $RPC_URL \
--constructor-args $PYTH_OP_SEPOLIA_ADDRESS $ETH_USD_ID
```
> Watch out that the `--broadcast` flag must be used before the `--constructor-args` to avoid errors!