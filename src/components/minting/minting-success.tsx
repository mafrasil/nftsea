"use client";

import { Button } from "@/components/ui/button";
import { resolveIPFSUrl } from "@/lib/ipfs";
import { CheckCircle, ExternalLink } from "lucide-react";

interface MintingSuccessProps {
  hash?: `0x${string}`;
  onMintAnother: () => void;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function MintingSuccess({
  hash,
  onMintAnother,
  title,
  description,
  imageUrl,
}: MintingSuccessProps) {
  return (
    <div className="py-6">
      {imageUrl && (
        <div className="mb-6">
          <img
            src={resolveIPFSUrl(imageUrl)}
            alt={title || "NFT"}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {title && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold mb-2 text-left">{title}</h3>
            <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Minted
            </span>
          </div>
          {hash && (
            <div className="mb-4">
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
              >
                View on Etherscan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {description && (
        <p className="text-gray-300 mb-6 text-left">{description}</p>
      )}

      <Button
        onClick={onMintAnother}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
      >
        Continue
      </Button>
    </div>
  );
}
