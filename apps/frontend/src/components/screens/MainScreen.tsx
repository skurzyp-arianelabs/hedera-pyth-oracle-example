import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePriceOperations } from '@/hooks/usePriceOperations';
import { TokenPairSelector } from '@/components/TokenPairSelector';
import { OnChainPriceDisplay } from '@/components/OnChainPriceDisplay';
import { OraclePriceDisplay } from '@/components/OraclePriceDisplay.tsx';

const MainScreen = () => {
  const [tokenPair, setTokenPair] = useState<string | null>(null);

  const { isConnected } = useWallet();
  const {
    handleFetchOraclePrice,
    handlePostPrice,
    handleFetchOnChainPrice,
    loading,
    posting,
    fetching,
    priceFeed,
    onChainPrice,
  } = usePriceOperations();

  const handleFetchPrice = () => {
    if (tokenPair) {
      handleFetchOraclePrice(tokenPair);
    }
  };

  return (
    <>
      <header>
        <div className="flex justify-center items-center p-4">
          <appkit-button />
        </div>
      </header>
      <div className="flex flex-col items-center w-1/3 mx-auto gap-y-6">
        <TokenPairSelector
          tokenPair={tokenPair}
          onTokenPairChange={setTokenPair}
          onFetchPrice={handleFetchPrice}
          loading={loading}
          disabled={!isConnected}
        />

        {priceFeed && (
          <OraclePriceDisplay
            priceFeed={priceFeed}
            onPostPrice={handlePostPrice}
            posting={posting}
            disabled={!isConnected}
          />
        )}

        <OnChainPriceDisplay
          onChainPrice={onChainPrice}
          onFetchOnChainPrice={handleFetchOnChainPrice}
          fetching={fetching}
          disabled={!isConnected}
        />
      </div>
    </>
  );
};

export default MainScreen;
