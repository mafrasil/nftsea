"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
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

  // Close sheet if user gets connected
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
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

        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Don't have a wallet?{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Learn more
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
