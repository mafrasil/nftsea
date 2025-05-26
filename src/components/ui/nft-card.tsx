"use client";

import { Badge } from "@/components/ui/badge";
import { resolveIPFSUrl } from "@/lib/ipfs";
import { formatAttributeValue, getTraitStyle } from "@/lib/nft";
import { NFTMetadata } from "@/types/nft";
import { useState } from "react";
import { NFTDetailsModal } from "./nft-details-modal";

interface NFTCardProps {
  tokenId: string;
  metadata?: NFTMetadata;
  contractAddress?: string;
}

export function NFTCard({ tokenId, metadata, contractAddress }: NFTCardProps) {
  const [showModal, setShowModal] = useState(false);

  if (!metadata) return null;

  return (
    <>
      <div
        className="bg-white/15 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-square relative">
          <img
            src={resolveIPFSUrl(metadata.image)}
            alt={metadata.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 rounded-lg px-2 py-1">
            <span className="text-xs text-gray-300">#{tokenId}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 truncate">
            {metadata.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {metadata.description}
          </p>

          {metadata.attributes && metadata.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {metadata.attributes.slice(0, 3).map((attr, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${getTraitStyle(attr)}`}
                >
                  {attr.trait_type}: {formatAttributeValue(attr)}
                </Badge>
              ))}
              {metadata.attributes.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-400">
                  +{metadata.attributes.length - 3} more
                </Badge>
              )}
            </div>
          )}
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
