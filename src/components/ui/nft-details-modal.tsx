"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { resolveIPFSUrl } from "@/lib/ipfs";
import {
  copyToClipboard,
  formatAttributeValue,
  getTraitStyle,
} from "@/lib/nft";
import { NFTMetadata } from "@/types/nft";
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
      <DialogContent className="max-w-2xl bg-black text-white max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <img
            src={resolveIPFSUrl(metadata.image)}
            alt={metadata.name}
            className="w-full h-64 object-cover rounded-lg"
          />

          <div>
            <h3 className="text-lg font-semibold mb-2">{metadata.name}</h3>
            <p className="text-gray-300">{metadata.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Badge
              variant="outline"
              className="p-2 w-full text-center bg-gray-500/20 border"
            >
              <div>
                <div className="text-xs opacity-70">Token ID</div>
                <div className="font-medium font-mono">#{tokenId}</div>
              </div>
            </Badge>

            {contractAddress && (
              <Badge
                variant="outline"
                className="p-2 w-full text-center bg-gray-500/20 border"
              >
                <div>
                  <div className="text-xs opacity-70">Contract</div>
                  <div className="font-medium font-mono text-sm">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </div>
                </div>
              </Badge>
            )}
          </div>

          {metadata.attributes && metadata.attributes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Attributes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {metadata.attributes.map((attr, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`p-2 w-full text-center ${getTraitStyle(attr)}`}
                  >
                    <div>
                      <div className="text-xs opacity-70">
                        {attr.trait_type}
                      </div>
                      <div className="font-medium">
                        {formatAttributeValue(attr)}
                      </div>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {copiedText && (
            <div className="text-center text-sm text-green-400">
              Copied {copiedText.length > 10 ? "address" : "ID"} to clipboard!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
