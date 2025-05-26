"use client";

import { Button } from "@/components/ui/button";
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
      <Button variant="outline">Connect Wallet</Button>
    </WalletConnectSheet>
  );
}
