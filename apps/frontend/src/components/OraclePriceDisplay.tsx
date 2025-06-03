import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { PriceUpdate } from '@pythnetwork/hermes-client';
import { formatPrice } from '@/lib/priceFeedUtils.ts';

interface PriceDisplayProps {
  priceFeed: PriceUpdate;
  onPostPrice: () => void;
  posting: boolean;
  disabled: boolean;
}

export const OraclePriceDisplay = ({
  priceFeed,
  onPostPrice,
  posting,
  disabled,
}: PriceDisplayProps) => {
  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle>HBAR/USDC Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                $
                {priceFeed.parsed?.[0]?.price &&
                  formatPrice(
                    Number(priceFeed.parsed[0].price.price),
                    Number(priceFeed.parsed[0].price.expo)
                  )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={onPostPrice}
          disabled={disabled || posting}
        >
          {posting ? 'Posting...' : 'Post price'}
        </Button>
      </CardFooter>
    </Card>
  );
};
