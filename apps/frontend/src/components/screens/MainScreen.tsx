import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { abi } from "@/assets/abi.json"
import { fetchPythPrice, getPriceFromContract, postPrice } from "@/lib/priceFeedUtils.ts";
import type { PriceUpdate } from "@pythnetwork/hermes-client";
import type { ContractBalance } from "@/types";
import { waitForTransactionReceipt } from "viem/actions";
import { createWalletClient, custom, publicActions } from "viem";
import { hederaTestnet } from "viem/chains";
import { toast } from "sonner";

const MainScreen: React.FC = () => {
  const [priceFeed, setPriceFeed] = useState<PriceUpdate | null>(null);
  const [onChainPrice, setOnChainPrice] = useState<ContractBalance | null>(null);
  const [tokenPair, setTokenPair] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  // Helper function to create viem wallet client
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

  const handleFetchPrice = async () => {
    if (!tokenPair) return;
    setLoading(true);
    try {
      // Map token pair name to actual price feed ID
      console.log("VITE_HBAR_USD_ID:  ", import.meta.env.VITE_HBAR_USD_ID);
      const priceFeedId = tokenPair === "HBAR/USDC" ? import.meta.env.VITE_HBAR_USD_ID : tokenPair;
      const fetchedPrice: PriceUpdate = await fetchPythPrice(priceFeedId);
      setPriceFeed(fetchedPrice);
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
      console.error("Wallet not connected or no price feed data");
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

      const receipt = await waitForTransactionReceipt(walletClient, {
        hash: txHash,
      });

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
      console.error("Missing wallet");
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

  const formatPrice = (price: number, expo: number): string => {
    const adjustedPrice = price * Math.pow(10, expo);
    return adjustedPrice.toFixed(Math.abs(expo));
  };

  return (
    <div>
      <header>
        <div className="flex justify-center items-center p-4">
          <appkit-button/>
        </div>
      </header>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Main Screen</CardTitle>
          <CardDescription>
            Fetch HBAR price from Pyth Oracle and post it to the Smart Contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="token-pair">Token Pair</Label>
              <Select onValueChange={(value) => setTokenPair(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Token Pair"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HBAR/USDC">HBAR/USDC</SelectItem>
                  {/* Add more pairs here if needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleFetchPrice}
            disabled={!tokenPair || loading || !address}
          >
            {loading ? "Fetching..." : "Fetch price"}
          </Button>
        </CardFooter>
      </Card>

      {priceFeed !== null && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>HBAR/USDC Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    ${priceFeed.parsed?.[0]?.price &&
                    formatPrice(
                      Number(priceFeed.parsed[0].price.price),
                      Number(priceFeed.parsed[0].price.expo)
                    )
                  }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handlePostPrice}
              disabled={!walletProvider || posting}
            >
              {posting ? "Posting..." : "Post price"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Step 3: Fetch from Contract</CardTitle>
          <CardDescription>
            Read getLatestPrice() from your consumer contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onChainPrice ? (
            <div className="flex flex-col gap-2">
              <div>
                <Label>Last Price (int64):</Label>{" "}
                {onChainPrice.lastPrice.toString()}
              </div>
              <div>
                <Label>Last Expo (int32):</Label>{" "}
                {onChainPrice.lastExpo.toString()}
              </div>
              <div>
                <Label>Last Updated (timestamp):</Label>{" "}
                {new Date(onChainPrice.lastUpdated * 1000).toLocaleString()}
              </div>
              <div className="mt-2">
                Equivalent USD:{" "}
                <strong>
                  $
                  {formatPrice(
                    onChainPrice.lastPrice,
                    onChainPrice.lastExpo
                  )}
                </strong>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>No on‑chain price yet.</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleFetchOnChainPrice}
            disabled={!walletProvider || fetching}
          >
            {fetching ? "Fetching…" : "Fetch on‑chain price"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MainScreen;