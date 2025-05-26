"use client";

import { MintingForm } from "@/components/minting";
import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/hero";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function MintPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-300 mb-8">
            You need to connect your wallet to mint NFTs
          </p>
          <Link href="/">
            <Button variant="outline">Go Back to Explorer</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <Hero subtitle="Upload your image and create metadata to mint your NFT on the blockchain.">
        Mint New NFT
      </Hero>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mint Form */}
          <MintingForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold font-cinzel">
                NFT{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-clip font-cinzel text-transparent bg-clip-text">
                  SEA
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                NFT Sea 2022 © All right reserved
              </span>
              <Button variant="gradient">Explore Marketplace</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
