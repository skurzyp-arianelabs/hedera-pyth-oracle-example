import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ContractBalance } from "@/types";

interface OnChainPriceDisplayProps {
  onChainPrice: ContractBalance | null;
  onFetchOnChainPrice: () => void;
  fetching: boolean;
  disabled: boolean;
}

const formatPrice = (price: number, expo: number): string => {
  const adjustedPrice = price * Math.pow(10, expo);
  return adjustedPrice.toFixed(Math.abs(expo));
};

export const OnChainPriceDisplay: React.FC<OnChainPriceDisplayProps> = ({
                                                                          onChainPrice,
                                                                          onFetchOnChainPrice,
                                                                          fetching,
                                                                          disabled
                                                                        }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>On-Chain Price</CardTitle>
        <CardDescription>
          Read getLatestPrice() from the on-chain contract
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
          onClick={onFetchOnChainPrice}
          disabled={disabled || fetching}
        >
          {fetching ? "Fetching…" : "Fetch on‑chain price"}
        </Button>
      </CardFooter>
    </Card>
  );
};