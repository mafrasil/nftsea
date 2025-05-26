"use client";

import { uploadMetadataToIPFS } from "@/actions/ipfs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNFTMint } from "@/hooks/useNFTContract";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ImageUpload } from "./image-upload-dropzone";
import { MintActions } from "./mint-actions";
import { MintingProgress } from "./minting-progress";
import { MintingSuccess } from "./minting-success";

type MintingStep = "form" | "uploading" | "minting" | "success" | "error";

interface CustomAttribute {
  trait_type: string;
  value: string;
}

export function MintingForm() {
  const { address } = useAccount();
  const {
    mint,
    isConfirming,
    isSuccess,
    hash,
    error: mintError,
  } = useNFTMint();

  const [step, setStep] = useState<MintingStep>("form");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageIPFSUrl, setImageIPFSUrl] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isUploadingMetadata, setIsUploadingMetadata] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
    { trait_type: "", value: "" },
  ]);
  const [imageUploadKey, setImageUploadKey] = useState(0);

  const handleImageUploaded = (ipfsUrl: string) => {
    setImageIPFSUrl(ipfsUrl);
    setIsImageUploading(false);
  };

  const addAttribute = () => {
    setCustomAttributes([...customAttributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: keyof CustomAttribute,
    value: string
  ) => {
    const updated = [...customAttributes];
    updated[index][field] = value;
    setCustomAttributes(updated);
  };

  const getValidCustomAttributes = () => {
    return customAttributes.filter(
      (attr) => attr.trait_type.trim() && attr.value.trim()
    );
  };

  // Helper function to parse error messages
  const parseErrorMessage = (error: Error | unknown): string => {
    if (!error) return "Unknown error occurred";

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle user rejection
    if (
      errorMessage.includes("User rejected") ||
      errorMessage.includes("User denied") ||
      errorMessage.includes("rejected the request")
    ) {
      return "Transaction was cancelled by user";
    }

    // Handle insufficient funds
    if (errorMessage.includes("insufficient funds")) {
      return "Insufficient funds to complete the transaction";
    }

    // Handle network errors
    if (errorMessage.includes("network")) {
      return "Network error. Please check your connection and try again";
    }

    // Handle contract errors
    if (errorMessage.includes("execution reverted")) {
      return "Transaction failed. The contract rejected the transaction";
    }

    // For other errors, try to extract a cleaner message
    if (errorMessage.includes("Details:")) {
      const details = errorMessage.split("Details:")[1];
      if (details) {
        return details.trim();
      }
    }

    // Fallback to a generic message
    return "Transaction failed. Please try again";
  };

  const handleMint = async () => {
    if (!address || !title || !description || !imageIPFSUrl) return;

    try {
      console.log("🔍 DEBUG: Starting mint process");

      setStep("uploading");
      setIsUploadingMetadata(true);
      setError(null);

      const metadataIPFSUrl = await uploadMetadataToIPFS(
        title,
        description,
        imageIPFSUrl,
        getValidCustomAttributes()
      );

      console.log("🔍 DEBUG: Metadata IPFS URL:", metadataIPFSUrl);

      setIsUploadingMetadata(false);
      setStep("minting");
      setIsMinting(true);

      // Wait for the transaction to be sent
      await mint(address, metadataIPFSUrl);

      // Keep minting state until transaction is confirmed
      // The success will be handled by the useEffect below
    } catch (error) {
      console.error("Minting failed:", error);
      const friendlyMessage = parseErrorMessage(error);
      setError(friendlyMessage);
      setStep("error");
      setIsUploadingMetadata(false);
      setIsMinting(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isSuccess && step === "minting") {
      setIsMinting(false);
      setStep("success");
    }
  }, [isSuccess, step]);

  // Handle mint errors from wagmi
  useEffect(() => {
    if (mintError && step === "minting") {
      console.error("Mint error:", mintError);
      const friendlyMessage = parseErrorMessage(mintError);
      setError(friendlyMessage);
      setStep("error");
      setIsMinting(false);
    }
  }, [mintError, step]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageIPFSUrl("");
    setCustomAttributes([{ trait_type: "", value: "" }]);
    setStep("form");
    setError(null);
    setIsUploadingMetadata(false);
    setIsMinting(false);
    setIsImageUploading(false);
    setImageUploadKey((prev) => prev + 1);
  };

  const resetToForm = () => {
    // Only reset the state, keep the form data
    setStep("form");
    setError(null);
    setIsUploadingMetadata(false);
    setIsMinting(false);
  };

  const canMint = title && description && imageIPFSUrl && !isImageUploading;

  return (
    <>
      {/* Form always visible */}
      <div className="space-y-6">
        <ImageUpload
          key={imageUploadKey}
          onImageUploaded={handleImageUploaded}
          isUploading={isImageUploading}
          setIsUploading={setIsImageUploading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter NFT title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your NFT"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Custom Attributes (Optional)
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAttribute}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {customAttributes.map((attr, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Trait type"
                  value={attr.trait_type}
                  onChange={(e) =>
                    updateAttribute(index, "trait_type", e.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={attr.value}
                  onChange={(e) =>
                    updateAttribute(index, "value", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAttribute(index)}
                  className="px-2"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <MintActions
          onMint={handleMint}
          disabled={!canMint}
          isLoading={step !== "form"}
        />
      </div>

      {/* Dialog only shows when not on form step */}
      <Dialog
        open={step !== "form"}
        onOpenChange={(open) => {
          // Allow closing the dialog to reset to form state
          if (!open) {
            resetToForm();
          }
        }}
      >
        <DialogTitle className="sr-only">Minting NFT</DialogTitle>
        <DialogContent className="max-w-md bg-black text-white">
          {step === "uploading" || step === "minting" ? (
            <MintingProgress
              step={step}
              isUploadingMetadata={isUploadingMetadata}
              isMinting={isMinting || isConfirming}
            />
          ) : step === "success" ? (
            <MintingSuccess
              hash={hash}
              onMintAnother={resetForm}
              title={title}
              description={description}
              imageUrl={imageIPFSUrl}
            />
          ) : step === "error" ? (
            <div className="text-center py-6">
              <div className="text-red-500 text-lg font-semibold mb-4">
                Minting Failed
              </div>
              <p className="text-gray-300 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetToForm}>
                  Close
                </Button>
                <Button
                  onClick={resetToForm}
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
