import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { ContractBalance } from '@/types';
import { formatPrice } from '@/lib/priceFeedUtils.ts';

interface OnChainPriceDisplayProps {
  onChainPrice: ContractBalance | null;
  onFetchOnChainPrice: () => void;
  fetching: boolean;
  disabled: boolean;
}

export const OnChainPriceDisplay = ({
  onChainPrice,
  onFetchOnChainPrice,
  fetching,
  disabled,
}: OnChainPriceDisplayProps) => {
  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle>On-Chain Price</CardTitle>
        <CardDescription>
          Read getLatestPrice() from the on-chain contract
        </CardDescription>
      </CardHeader>
      <CardContent>
        {onChainPrice ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <Label>Last Price (int64):</Label>
              <span>{onChainPrice.lastPrice.toString()}</span>
            </div>
            <div className="flex justify-between">
              <Label>Last Expo (int32):</Label>
              <span>{onChainPrice.lastExpo.toString()}</span>
            </div>
            <div className="flex justify-between">
              <Label>Last Updated (timestamp):</Label>
              <span>
                {new Date(onChainPrice.lastUpdated * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Equivalent USD:</span>
              <span>
                ${formatPrice(onChainPrice.lastPrice, onChainPrice.lastExpo)}
              </span>
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
          {fetching ? 'Fetching…' : 'Fetch on‑chain price'}
        </Button>
      </CardFooter>
    </Card>
  );
};
