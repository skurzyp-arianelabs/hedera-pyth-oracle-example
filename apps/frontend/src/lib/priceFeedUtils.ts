import {
  getContract,
  createWalletClient,
  custom,
  publicActions,
  parseEther,
} from 'viem';
import { hederaTestnet } from 'viem/chains';
import { HermesClient, type PriceUpdate } from '@pythnetwork/hermes-client';
import type { ContractBalance } from '@/types';

export const postPrice = async (
  address: `0x${string}`,
  walletProvider: any,
  contractAddress: string,
  abi: any,
  priceFeedUpdateData: PriceUpdate
) => {
  // Create a viem wallet client from the provider
  const walletClient = createWalletClient({
    account: address,
    chain: hederaTestnet,
    transport: custom(walletProvider),
  }).extend(publicActions);

  const contract = getContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    client: walletClient,
  });

  console.debug(
    'priceFeedUpdateData.binary.data: ' +
      JSON.stringify(priceFeedUpdateData.binary.data)
  );

  const rawHex = priceFeedUpdateData.binary.data[0];
  const oneBytesElement = rawHex.startsWith('0x') ? rawHex : `0x${rawHex}`;
  const updateDataArray = [oneBytesElement];

  const hash = await contract.write.updatePrice([updateDataArray as any], {
    value: parseEther('10'),
  });

  console.log('Transaction hash:', hash);
  return hash;
};

export const fetchPythPrice = async (
  priceFeedId: string
): Promise<PriceUpdate> => {
  const connection = new HermesClient('https://hermes.pyth.network');
  const priceIds = [priceFeedId];
  const priceFeedUpdateData: PriceUpdate =
    await connection.getLatestPriceUpdates(priceIds);
  console.log('Retrieved Pyth price update:');
  console.log(priceFeedUpdateData);

  return priceFeedUpdateData;
};

export const getPriceFromContract = async (
  address: `0x${string}`,
  walletProvider: any,
  contractAddress: string,
  abi: any
): Promise<ContractBalance> => {
  // Create a viem wallet client from the provider
  const walletClient = createWalletClient({
    account: address,
    chain: hederaTestnet,
    transport: custom(walletProvider),
  }).extend(publicActions);

  const contract = getContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    client: walletClient,
  });


  // @ts-ignore
  const [lp, le, lu]: [bigint, number, bigint] = await contract.read.getLatestPrice();

  return {
    lastPrice: Number(lp),
    lastExpo: le,
    lastUpdated: Number(lu),
  };
};

export const formatPrice = (price: number, expo: number): string => {
  const adjustedPrice = price * Math.pow(10, expo);
  return adjustedPrice.toFixed(Math.abs(expo));
};
