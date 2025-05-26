"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { resolveIPFSUrl } from "@/lib/ipfs";
import { copyToClipboard, formatAttributeValue } from "@/lib/nft";
import { NFTMetadata } from "@/types/nft";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface NFTDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: string;
  metadata?: NFTMetadata;
  contractAddress?: string;
}

export function NFTDetailsModal({
  isOpen,
  onClose,
  tokenId,
  metadata,
  contractAddress,
}: NFTDetailsModalProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (!metadata) return null;

  const handleCopyToClipboard = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const openOnOpenSea = () => {
    if (contractAddress) {
      window.open(
        `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`,
        "_blank"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">NFT Details</DialogTitle>
      <DialogContent className="!max-w-5xl p-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image */}
          <div className="lg:w-5/12 p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
              <img
                src={resolveIPFSUrl(metadata.image)}
                alt={metadata.name}
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="lg:w-7/12 p-8 flex flex-col">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3 font-cinzel">
              {metadata.name}
            </h2>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-base font-bold">DESCRIPTION</h3>
              <p className="text-gray-300 leading-relaxed">
                {metadata.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, a habitant a consequat elementum nisl. Phasellus facilisis urna facilisis aliquet enim congue. Libero amet proin phasellus pretium."}
              </p>
            </div>

            <div className="border-t border-neutral-700 mb-6"></div>

            {/* Details Collapsible Section */}
            <div className="space-y-4">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                tabIndex={-1}
                className="w-full flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-700/50 transition-colors"
              >
                <span className="text-lg font-medium">Details</span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    isDetailsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDetailsOpen && (
                <div className="space-y-4 p-4 bg-neutral-900/30 rounded-lg">
                  {/* Token ID and Contract */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                      <span className="text-neutral-400">Token ID</span>
                      <span className="font-mono text-white">#{tokenId}</span>
                    </div>

                    {contractAddress && (
                      <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                        <span className="text-neutral-400">
                          Contract Address
                        </span>
                        <button
                          onClick={() => handleCopyToClipboard(contractAddress)}
                          className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {contractAddress.slice(0, 6)}...
                          {contractAddress.slice(-4)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Attributes */}
                  {metadata.attributes && metadata.attributes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3 text-white">
                        Attributes
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {metadata.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="p-3 bg-neutral-800/50 rounded-lg border border-neutralAll right reserved-700/50"
                          >
                            <div className="text-xs text-neutral-400 mb-1">
                              {attr.trait_type}
                            </div>
                            <div className="font-medium text-white">
                              {formatAttributeValue(attr)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {copiedText && (
              <div className="mt-4 text-center text-sm text-green-400">
                Copied {copiedText.length > 10 ? "address" : "ID"} to clipboard!
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
