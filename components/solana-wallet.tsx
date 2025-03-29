"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Trash, Plus, Eye, EyeOff, Copy } from "lucide-react";

interface Wallet {
  id: number;
  publicKey: string;
  privateKey: string;
}

const SolanaWallet = () => {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{ [key: number]: boolean }>({});

  // Load wallets from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("solana_wallets");
    if (storedData) {
      setWallets(JSON.parse(storedData));
    }
  }, []);

  // Save wallets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("solana_wallets", JSON.stringify(wallets));
  }, [wallets]);

  // Generate Mnemonic & First Wallet
  const handleGenerateWallet = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    generateWallet();
  };

  // Generate Solana Public & Private Keys (Using Different Paths)
  const generateWallet = () => {
    if (!mnemonic) {
      toast.error("Please generate a mnemonic first!");
      return;
    }

    const seed = mnemonicToSeedSync(mnemonic);
    const walletIndex = wallets.length; // Each wallet has a different index
    const derivedSeed = seed.slice(walletIndex, walletIndex + 32);
    const keypair = Keypair.fromSeed(derivedSeed);

    const newWallet = {
      id: wallets.length + 1,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    };

    setWallets([...wallets, newWallet]);
    setVisiblePrivateKeys((prev) => ({ ...prev, [newWallet.id]: false })); // Default private key is hidden
    toast.success(`Wallet ${newWallet.id} Generated!`);
  };

  // Copy Mnemonic to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Secret phrase copied to clipboard!");
  };

  // Toggle Private Key Visibility
  const togglePrivateKeyVisibility = (id: number) => {
    setVisiblePrivateKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteAllWallets = () => {
    setWallets([]);
    setMnemonic("");
    localStorage.removeItem("solana_wallets");
    toast.error("All Wallets Deleted!");
  };

  return (
    <div className="flex flex-col w-full gap-6 mt-10 h-full px-6">
      {/* Generate Wallet Button */}
      {!mnemonic && (
        <div className="flex gap-3 flex-col p-3 mt-24">
          <h2 className="w-fit text-5xl font-bold">Secret Recovery Phrase</h2>
          <p className="w-fit text-2xl text-neutral-300">Save these words in a safe place.</p>
          <Button size="lg" className="w-fit" onClick={handleGenerateWallet}>
            Generate Wallet
          </Button>
        </div>
      )}

      {/* Display Mnemonic Words */}
      {mnemonic && (
        <div className="w-full mt-20 border py-6 px-4 rounded-md">
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="w-fit text-3xl font-semibold">Your Secret Phrase</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy size={18} className="mr-1" /> Copy
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setShowMnemonic(!showMnemonic)}>
                {showMnemonic ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </Button>
            </div>
          </div>

          {/* Show Mnemonic Words in a Grid */}
          {showMnemonic && (
            <div className="grid grid-cols-4 gap-2 w-full p-4 bg-neutral-800 rounded-lg shadow-md mt-4">
              {mnemonic.split(" ").map((word, index) => (
                <div key={index} className="py-3 bg-neutral-900 text-white rounded-md text-center">
                  {word}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {mnemonic && (
          <Button size="lg" className="w-fit cursor-pointer" onClick={generateWallet}>
            <Plus size={18} className="mr-2" />
            Add Wallet
          </Button>
        )}
         {wallets.length > 1 && (
          <Button size="lg" variant="destructive" className="w-fit" onClick={handleDeleteAllWallets}>
            Delete Wallets
          </Button>
        )}
      </div>

      {/* Display Wallets */}
      {wallets.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="px-5 py-3 border rounded-lg shadow-md flex flex-col gap-4 relative bg-neutral-800 text-white">
              <h2 className="text-xl w-fit pl-3 font-bold">Wallet {wallet.id}</h2>
              <div className="px-4 py-5 rounded-md flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <strong className="text-2xl w-fit text-neutral-300">Public Key</strong>
                  <span className="w-fit">{wallet.publicKey}</span>
                </div>

                {/* Private Key Section with Eye Toggle */}
                <div className="flex flex-col w-fit gap-2 relative">
                  <strong className="text-2xl w-fit text-neutral-300">Private Key</strong>
                  <div className="flex items-center gap-2">
                    <span className="w-fit ">
                      {visiblePrivateKeys[wallet.id] ? wallet.privateKey : "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • "}
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => togglePrivateKeyVisibility(wallet.id)}>
                      {visiblePrivateKeys[wallet.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Delete Individual Wallet Button */}
              <Button size="sm" onClick={() => toast.error("Deleting wallets is disabled for now.")} className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white">
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolanaWallet;
