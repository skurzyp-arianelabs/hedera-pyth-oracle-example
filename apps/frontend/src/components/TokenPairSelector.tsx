import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TokenPairSelectorProps {
  tokenPair: string | null;
  onTokenPairChange: (value: string) => void;
  onFetchPrice: () => void;
  loading: boolean;
  disabled: boolean;
}

export const TokenPairSelector = ({
  tokenPair,
  onTokenPairChange,
  onFetchPrice,
  loading,
  disabled,
}: TokenPairSelectorProps) => {
  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle>Select Token Pair</CardTitle>
        <CardDescription>
          <span className="font-bold">Choose a token pair</span> to fetch price
          from Pyth Oracle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="token-pair">Token Pair</Label>
          <Select onValueChange={onTokenPairChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Token Pair" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HBAR/USDC">HBAR/USDC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={onFetchPrice}
          disabled={!tokenPair || loading || disabled}
        >
          {loading ? 'Fetching...' : 'Fetch price'}
        </Button>
      </CardFooter>
    </Card>
  );
};
