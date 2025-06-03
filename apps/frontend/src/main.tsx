import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createAppKit } from '@reown/appkit';
import { hederaTestnet } from '@reown/appkit/networks';
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

const metadata = {
  name: 'Test',
  description: 'AppKit Example',
  url: 'http://localhost:5173/',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [hederaTestnet],
  metadata,
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID!,
  themeMode: 'light',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
