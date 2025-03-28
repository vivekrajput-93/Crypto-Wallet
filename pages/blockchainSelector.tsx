"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BlockchainSelectorProps {
  onSelectPath: (path: string) => void;
}

export const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({
  onSelectPath,
}) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const router = useRouter();

  const handleSelector = (path: string) => {
    setSelectedPath(path);
    onSelectPath(path);
    toast.success(
      `${
        path === "501" ? "Solana" : "Ethereum"
      } wallet is created. Please generate a wallet`
    );
    router.push(path === "501" ? "/solana-wallet" : "/ethereum-wallet");
  };

  return (
    <div className="flex justify-center place-items-center h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex flex-col my-12 gap-4"
      >
        <h1 className="text-4xl font-semibold text-green-500">Effortless Crypto Across Blockchains using Mudra</h1>
        <p  className=" text-center text-primary/80 font-semibold text-lg md:text-xl">
          Choose a blockchain to get started.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            size={"lg"}
            onClick={() => {
              handleSelector("501");
            }}
          >
            Solana
          </Button>
          <Button
           size={"lg"}
            onClick={() => handleSelector("60")}
            
          >
            Ethereum
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
