"use client";

import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectedWallet } from "./connected-wallet";
import { WalletConnectSheet } from "./wallet-connect-sheet";

export function WalletConnector() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <ConnectedWallet />;
  }

  return (
    <WalletConnectSheet>
      <Button variant="ghost">
        <WalletIcon className="w-4 h-4" />
      </Button>
    </WalletConnectSheet>
  );
}
