"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import BlockchainSelector from "@/components/blockchainSelector";
import SolanaWallet from "@/components/solana-wallet";
import EthereumWallet from "@/components/ethereum-wallet";


export default function Home() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="max-w-full h-[100%]">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        {!selectedPath ? (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight text-green-500 sm:text-5xl">
              Effortless Crypto Across Blockchains
            </h1>
            <p className="text-lg text-primary/80 font-semibold mt-4">
              Choose a blockchain to get started.
            </p>

            {/* Blockchain Selector Component */}
            <BlockchainSelector onSelectPath={setSelectedPath} />
          </>
        ) : selectedPath === "501" ? (
          <SolanaWallet  />
        ) : (
          <EthereumWallet  />
        )}
      </div>

    </div>
  );
}
