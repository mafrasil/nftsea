"use client";

import { Button } from "@/components/ui/button";
import { WalletConnector } from "@/components/wallet";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold font-cinzel">
            NFT{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-clip font-cinzel text-transparent bg-clip-text">
              SEA
            </span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="link">Explore Marketplace</Button>
          <WalletConnector />
        </div>
      </div>
    </header>
  );
}
