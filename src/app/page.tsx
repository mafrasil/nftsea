"use client";

import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/hero";
import { NFTCard } from "@/components/ui/nft-card";
import { useUserNFTsAlchemy } from "@/hooks/useUserNFTs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function ExplorerPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { nfts, loading, balance } = useUserNFTsAlchemy();

  console.log(nfts);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-white">
        <Hero>Listing Owned NFTs</Hero>
        <div className="container mx-auto text-center text-sm my-12">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Hero Section */}
      <Hero>Listing Owned NFTs</Hero>

      {!loading && (
        <div className="container mx-auto text-center text-sm my-12">
          {!isConnected ? (
            <p>Connect your wallet to view your NFT collection</p>
          ) : (
            <p>
              You own {balance} NFT{balance !== 1 ? "s" : ""} from this
              collection
            </p>
          )}
        </div>
      )}

      {/* NFT Grid */}
      {isConnected && (
        <div className="container mx-auto px-4 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
              <p className="text-gray-300">Loading your NFTs...</p>
            </div>
          ) : balance === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg mb-4">
                You don&apos;t own any NFTs from this collection yet.
              </p>
              <Link href="/mint">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Mint Your First NFT
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.tokenId}
                  tokenId={nft.tokenId}
                  metadata={nft.metadata}
                  contractAddress={process.env.NEXT_PUBLIC_NFT_ADDRESS}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Mint Button */}
      <Link href="/mint">
        <Button
          size="lg"
          variant="gradient"
          className="fixed bottom-6 right-6 hover:scale-110 transition-transform duration-300 rounded-full h-14 w-14 cursor-pointer group/btn"
        >
          <Plus className="size-5 group-hover/btn:rotate-90 transition-transform duration-300" />
        </Button>
      </Link>
    </div>
  );
}

export default ExplorerPage;
