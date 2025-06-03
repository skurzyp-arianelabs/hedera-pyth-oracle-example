import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePriceOperations } from '@/hooks/usePriceOperations';
import { TokenPairSelector } from '@/components/TokenPairSelector';
import { OnChainPriceDisplay } from '@/components/OnChainPriceDisplay';
import { OraclePriceDisplay } from '@/components/OraclePriceDisplay.tsx';

const MainScreen: React.FC = () => {
  const [tokenPair, setTokenPair] = useState<string | null>(null);

  const wallet = useWallet();
  const priceOps = usePriceOperations(wallet);

  const handleFetchPrice = () => {
    if (tokenPair) {
      priceOps.handleFetchOraclePrice(tokenPair);
    }
  };

  return (
    <div>
      <header>
        <div className="flex justify-center items-center p-4">
          <appkit-button />
        </div>
      </header>

      <TokenPairSelector
        tokenPair={tokenPair}
        onTokenPairChange={setTokenPair}
        onFetchPrice={handleFetchPrice}
        loading={priceOps.loading}
        disabled={!wallet.isConnected}
      />

      {priceOps.priceFeed && (
        <OraclePriceDisplay
          priceFeed={priceOps.priceFeed}
          onPostPrice={priceOps.handlePostPrice}
          posting={priceOps.posting}
          disabled={!wallet.isConnected}
        />
      )}

      <OnChainPriceDisplay
        onChainPrice={priceOps.onChainPrice}
        onFetchOnChainPrice={priceOps.handleFetchOnChainPrice}
        fetching={priceOps.fetching}
        disabled={!wallet.isConnected}
      />
    </div>
  );
};

export default MainScreen;
