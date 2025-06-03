import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { createWalletClient, custom, publicActions } from "viem";
import { hederaTestnet } from "viem/chains";

export const useWallet = () => {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const createWalletClientInstance = () => {
    if (!walletProvider || !address) {
      throw new Error("Wallet not connected");
    }

    return createWalletClient({
      account: address as `0x${string}`,
      chain: hederaTestnet,
      transport: custom(walletProvider as any)
    }).extend(publicActions);
  };

  return {
    address,
    walletProvider,
    createWalletClientInstance,
    isConnected: !!(address && walletProvider)
  };
};