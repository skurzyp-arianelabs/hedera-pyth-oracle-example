import { useState } from "react";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "viem/actions";
import { fetchPythPrice, getPriceFromContract, postPrice } from "@/lib/priceFeedUtils.ts";
import { abi } from "@/assets/abi.json";
import type { PriceUpdate } from "@pythnetwork/hermes-client";
import type { ContractBalance } from "@/types";
import type { useWallet } from "@/hooks/useWallet.ts";

export const usePriceOperations = (walletHook: ReturnType<typeof useWallet>) => {
  const [priceFeed, setPriceFeed] = useState<PriceUpdate | null>(null);
  const [onChainPrice, setOnChainPrice] = useState<ContractBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const { address, walletProvider, createWalletClientInstance } = walletHook;

  const handleFetchOraclePrice = async (tokenPair: string) => {
    if (!tokenPair) return;
    setLoading(true);
    try {
      const priceFeedId = tokenPair === "HBAR/USDC" ? import.meta.env.VITE_HBAR_USD_ID : tokenPair;
      const fetchedPrice: PriceUpdate = await fetchPythPrice(priceFeedId);
      setPriceFeed(fetchedPrice);
      toast.success("Price fetched successfully!");
    } catch (error) {
      console.error("Error fetching price:", error);
      toast.error("Failed to fetch price", {
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostPrice = async () => {
    if (!walletProvider || !priceFeed) {
      toast.error("Error", {
        description: "Wallet not connected or no price feed data",
      });
      return;
    }

    setPosting(true);
    try {
      const txHash = await postPrice(
        address as `0x${string}`,
        walletProvider,
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        priceFeed
      );

      toast.info("Transaction submitted", {
        description: `Waiting for confirmation...`,
      });

      const walletClient = createWalletClientInstance();
      const receipt = await waitForTransactionReceipt(walletClient, { hash: txHash });

      if (receipt.status === 'success') {
        toast.success("Price posted successfully!", {
          description: `Tx Hash: ${txHash}`,
        });
      } else {
        toast.error("Transaction failed", {
          description: `Tx Hash: ${txHash}`,
        });
      }
    } catch (error) {
      console.error("Error posting price:", error);
      toast.error("Transaction error", {
        description: String(error),
      });
    } finally {
      setPosting(false);
    }
  };

  const handleFetchOnChainPrice = async () => {
    if (!walletProvider || !address) {
      toast.error("Error", {
        description: "Wallet not connected",
      });
      return;
    }

    setFetching(true);
    try {
      const result: ContractBalance = await getPriceFromContract(
        address as `0x${string}`,
        walletProvider,
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi
      );
      setOnChainPrice(result);
      toast.success("On-chain price fetched successfully!");
    } catch (e) {
      console.error("Error reading on-chain price:", e);
      toast.error("Failed to fetch on-chain price", {
        description: String(e),
      });
    } finally {
      setFetching(false);
    }
  };

  return {
    priceFeed,
    onChainPrice,
    loading,
    posting,
    fetching,
    handleFetchOraclePrice,
    handlePostPrice,
    handleFetchOnChainPrice
  };
};
