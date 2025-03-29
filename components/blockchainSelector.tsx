"use client";

import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import { motion } from "framer-motion";

interface BlockchainSelectorProps {
  onSelectPath: (path: string) => void;
}

const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ onSelectPath }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center mt-10 gap-6"
    >
      <div className="flex gap-4">
        <Button size="lg"  onClick={() => onSelectPath("501")}>
          Solana
        </Button>
        <Button size="lg" onClick={() => onSelectPath("60")}>
          Ethereum
        </Button>
      </div>
    </motion.div>
  );
};

export default BlockchainSelector;
