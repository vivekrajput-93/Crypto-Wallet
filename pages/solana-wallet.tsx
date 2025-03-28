"use client";

import { Navbar } from "@/components/Navbar";
import WalletGenerator from "./WalletGenerator";

export default function SolanaWalletPage() {
  return (
      <>
          <Navbar />
          <WalletGenerator selectedPath="501" />
      </>
  );
}
