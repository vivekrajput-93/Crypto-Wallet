"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import { Wallet } from "ethers";
import bs58 from "bs58";
import "../CSS/walletGenerator.css"

interface WalletGeneratorProps {
  selectedPath: string;
}

const WalletGenerator: React.FC<WalletGeneratorProps> = ({ selectedPath }) => {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [mnemonicInput, setMnemonicInput] = useState<string>("");

  const handleGenerateWallet = () => {
    const generatedMnemonic = generateMnemonic();
    setMnemonic(generatedMnemonic);
    generateWallet(generatedMnemonic);
  };

  const generateWallet = (mnemonic: string) => {
    const seed = mnemonicToSeedSync(mnemonic);
    let walletPublicKey = "";
    let walletPrivateKey = "";

    if (selectedPath === "501") {
      // Solana Wallet
      const keypair = Keypair.fromSeed(seed.slice(0, 32));
      walletPublicKey = keypair.publicKey.toBase58();
      walletPrivateKey = bs58.encode(keypair.secretKey);
    } else if (selectedPath === "60") {
      // Ethereum Wallet
      const wallet = Wallet.fromPhrase(mnemonic);
      walletPublicKey = wallet.address;
      walletPrivateKey = wallet.privateKey;
    }

    setPublicKey(walletPublicKey);
    setPrivateKey(walletPrivateKey);

    // Store in localStorage
    localStorage.setItem(
      "wallet",
      JSON.stringify({ mnemonic, publicKey: walletPublicKey, privateKey: walletPrivateKey })
    );

    toast.success("Wallet successfully created!");
  };

  const handleImportWallet = () => {
    if (!validateMnemonic(mnemonicInput)) {
      toast.error("Invalid mnemonic phrase!");
      return;
    }
    generateWallet(mnemonicInput);
  };

  return (
    <div className="flex flex-col gap-4 main-wallet-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col my-12 gap-4"
      >
        <h1 className="text-4xl font-semibold text-green-500">
          {selectedPath === "501" ? "Solana Wallet" : "Ethereum Wallet"}
        </h1>
        <p className="text-primary/80 font-semibold text-lg md:text-xl">
          {mnemonic ? "Save your recovery phrase securely." : "Generate or import a wallet."}
        </p>

        {!mnemonic ? (
          <div className="flex gap-4">
            <Button size="lg" onClick={handleGenerateWallet}>
              Generate Wallet
            </Button>
            <Input
              type="password"
              placeholder="Enter mnemonic to import"
              value={mnemonicInput}
              onChange={(e) => setMnemonicInput(e.target.value)}
            />
            <Button size="lg" onClick={handleImportWallet}>
              Import Wallet
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <h2 className="font-bold">Your Secret Phase:</h2>
              <p>{mnemonic}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h2 className="font-bold">Public Key:</h2>
              <p>{publicKey}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h2 className="font-bold">Private Key:</h2>
              <p>{privateKey}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WalletGenerator;
