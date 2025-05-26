"use client";

import { CheckCircle, Loader2, Upload } from "lucide-react";

interface MintingProgressProps {
  step: "uploading" | "minting";
  isUploadingMetadata: boolean;
  isMinting: boolean;
}

export function MintingProgress({
  step,
  isUploadingMetadata,
  isMinting,
}: MintingProgressProps) {
  return (
    <div className="text-center py-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {step === "uploading" ? "Uploading to IPFS" : "Minting NFT"}
        </h3>
        <p className="text-gray-400">
          {step === "uploading"
            ? "Uploading your metadata to IPFS..."
            : "Confirming transaction on blockchain..."}
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload Step */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5" />
            <span>Upload metadata to IPFS</span>
          </div>
          {isUploadingMetadata ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : step === "minting" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
          )}
        </div>

        {/* Mint Step */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded border-2 border-current" />
            <span>Mint NFT on blockchain</span>
          </div>
          {isMinting ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : step === "minting" && !isMinting ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-400">
        Please don't close this window while the process is running.
      </div>
    </div>
  );
}
