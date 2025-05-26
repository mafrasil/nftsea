"use client";

import { Button } from "@/components/ui/button";

interface MintActionsProps {
  onMint: (listImmediately?: boolean) => void;
  disabled: boolean;
  isLoading: boolean;
}

export function MintActions({ onMint, disabled, isLoading }: MintActionsProps) {
  return (
    <div className="flex gap-4 pt-6">
      <Button
        variant="outline"
        className="flex-1 h-14 font-semibold bg-transparent border-gray-600 text-white hover:bg-gray-800"
        onClick={() => onMint(false)}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Processing..." : "Mint without listing"}
      </Button>
      <Button
        variant="gradient"
        className="flex-1 h-14 font-semibold"
        onClick={() => onMint(true)}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Processing..." : "Mint and list immediately"}
      </Button>
    </div>
  );
}
