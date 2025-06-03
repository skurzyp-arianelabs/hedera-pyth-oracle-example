import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import dotenv from 'dotenv'

// Load env from monorepo root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_REOWN_PROJECT_ID': JSON.stringify(process.env.VITE_REOWN_PROJECT_ID),
    'import.meta.env.VITE_HBAR_USD_ID': JSON.stringify(process.env.HBAR_USD_ID),
    'import.meta.env.VITE_CONTRACT_ADDRESS': JSON.stringify(process.env.VITE_CONTRACT_ADDRESS),
  },
})
