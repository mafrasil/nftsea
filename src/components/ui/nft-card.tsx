"use client";

import { useETHPrice } from "@/hooks/useETHPrice";
import { resolveIPFSUrl } from "@/lib/ipfs";
import { NFTMetadata } from "@/types/nft";
import Image from "next/image";
import { useState } from "react";
import { EthIcon } from "../icons/eth";
import { NFTDetailsModal } from "./nft-details-modal";

interface NFTCardProps {
  tokenId: string;
  metadata?: NFTMetadata;
  contractAddress?: string;
}

export function NFTCard({ tokenId, metadata, contractAddress }: NFTCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { data: ethPrice, isLoading: priceLoading } = useETHPrice();

  if (!metadata) return null;

  // Random ETH amount between 0.1 and 25
  const fakeETHAmount = Math.random() * 24.9 + 0.1;
  const fakeUsdPrice = ethPrice
    ? `$${(fakeETHAmount * ethPrice).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "$3,410.32"; // fallback

  return (
    <>
      <div
        className="bg-white/15 rounded-lg backdrop-blur-lg group/nft-card cursor-pointer hover:scale-[1.025] transition-all duration-300"
        onClick={() => setShowModal(true)}
      >
        {/* NFT Image */}
        <div className="aspect-[255/214] relative bg-gradient-to-br from-gray-100 to-gray-200 m-3 rounded-xl overflow-hidden">
          <Image
            src={resolveIPFSUrl(metadata?.image || "")}
            alt={metadata?.name || `NFT #${tokenId}`}
            fill
            objectFit="cover"
            objectPosition="center"
          />
          <div className="absolute top-2 right-2 bg-black/50 group-hover/nft-card:bg-black/70 transition-all duration-300 rounded-lg px-2 py-1 opacity-0 group-hover/nft-card:opacity-100">
            <span className="text-xs text-gray-300">#{tokenId}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4">
          <h3 className="text-2xl font-bold text-white tracking-wide font-cinzel">
            {metadata.name}
          </h3>

          {/* Current Price Section */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-2 font-thin">
              Current Price
            </p>
            <div className="flex items-center gap-2">
              <EthIcon size={24} withCircle />
              <span className="text-xl font-bold text-[#EC4467] font-cinzel">
                {fakeETHAmount.toFixed(2)} ETH
              </span>
              <span className="text-gray-400 text-base">
                {priceLoading ? "(Loading...)" : `(${fakeUsdPrice})`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <NFTDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tokenId={tokenId}
        metadata={metadata}
        contractAddress={contractAddress}
      />
    </>
  );
}
