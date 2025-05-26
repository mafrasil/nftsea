"use client";

import { uploadImageToIPFS } from "@/actions/ipfs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, UploadCloud, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ImageUploadProps {
  onImageUploaded: (ipfsUrl: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export function ImageUpload({
  onImageUploaded,
  isUploading,
  setIsUploading,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const ipfsUrl = await uploadImageToIPFS(formData);
      onImageUploaded(ipfsUrl);
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, setIsUploading, onImageUploaded]);

  // Auto-upload when file is selected
  useEffect(() => {
    if (selectedFile && uploadStatus === "idle") {
      handleUpload();
    }
  }, [selectedFile, uploadStatus, handleUpload]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    setUploadStatus("idle");

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadStatus("idle");
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-dashed border-2 rounded-lg bg-neutral-800 p-8 text-center transition-colors",
          "hover:border-neutral-600 hover:bg-neutral-700/50",
          selectedFile
            ? "border-primary bg-neutral-900/50"
            : "border-neutral-500"
        )}
        onDrop={(e) => {
          e.preventDefault();
          handleFileSelect(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        {preview ? (
          <div className="space-y-4 flex flex-col items-center justify-center">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="max-w-full max-h-48 object-contain rounded-lg"
            />

            {/* Upload Status Indicator */}
            <div className="flex items-center justify-center space-x-2">
              {uploadStatus === "uploading" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Uploading to IPFS...
                  </span>
                </>
              )}
              {uploadStatus === "success" && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    Upload complete!
                  </span>
                </>
              )}
              {uploadStatus === "error" && (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    Upload failed. Please try again.
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSelection}
                disabled={isUploading}
              >
                Change Image
              </Button>
              {uploadStatus === "error" && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  Retry Upload
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Choose an image</p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}

        {!preview && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
