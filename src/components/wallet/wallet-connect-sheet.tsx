"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { WalletOption } from "./wallet-option";

interface WalletConnectSheetProps {
  children: React.ReactNode;
}

export function WalletConnectSheet({ children }: WalletConnectSheetProps) {
  const [open, setOpen] = useState(false);
  const { connectors, connect, status } = useConnect();
  const { isConnected } = useAccount();

  const handleConnect = (connector: any) => {
    connect({ connector });
    setOpen(false);
  };

  if (isConnected && open) {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-[400px] bg-black text-white border-gray-800"
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <SheetTitle className="text-2xl font-bold text-white">
            Connect Wallet
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onConnect={() => handleConnect(connector)}
              isLoading={status === "pending"}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Don't have a wallet?{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient-rainbow font-semibold"
            >
              Learn more
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
