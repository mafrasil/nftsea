"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Connector } from "wagmi";

interface WalletOptionProps {
  connector: Connector;
  onConnect: () => void;
  isLoading: boolean;
}

const getWalletIcon = (name: string) => {
  const walletName = name.toLowerCase();

  if (walletName.includes("metamask")) {
    return "🦊";
  }
  if (walletName.includes("walletconnect") || walletName.includes("portis")) {
    return "💎";
  }
  if (walletName.includes("torus")) {
    return "🔷";
  }
  if (walletName.includes("coinbase") || walletName.includes("walletlink")) {
    return "🔵";
  }
  return "🔗";
};

export function WalletOption({
  connector,
  onConnect,
  isLoading,
}: WalletOptionProps) {
  return (
    <Button
      onClick={onConnect}
      disabled={isLoading}
      className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg flex items-center justify-start px-4 space-x-3"
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className="text-xl">{getWalletIcon(connector.name)}</span>
      )}
      <span className="text-base font-medium">Connect {connector.name}</span>
    </Button>
  );
}
