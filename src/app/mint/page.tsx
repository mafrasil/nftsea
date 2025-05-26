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
      <div className="text-white flex-1 flex items-center justify-center">
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
    <div className="text-white">
      <Hero subtitle="Upload your image and create metadata to mint your NFT on the blockchain.">
        Mint New NFT
      </Hero>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <MintingForm />
        </div>
      </div>
    </div>
  );
}
