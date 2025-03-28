"use client"; // ✅ Make this a Client Component

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BlockchainSelector } from "@/pages/blockchainSelector";


export default function Home() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleBlockchainSelect = (path: string) => {
    console.log("Selected Blockchain Path:", path);
    setSelectedPath(path);
  };

  return (
    <div className="max-w-full">
      <Navbar />
      <BlockchainSelector onSelectPath={handleBlockchainSelect} />
    </div>
  );
}
