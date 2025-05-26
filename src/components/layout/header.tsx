"use client";

import { Button } from "@/components/ui/button";
import { WalletConnector } from "@/components/wallet";
import { useETHPrice } from "@/hooks/useETHPrice";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EthIcon } from "../icons/eth";
import Logo from "../ui/logo";

function ETHPriceDisplay() {
  const { data: ethPrice, isLoading, error } = useETHPrice();

  if (error) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
      <EthIcon size={14} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white leading-none">
          {isLoading ? (
            <span className="animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          ) : (
            `$${ethPrice?.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`
          )}
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200",
        isScrolled && "bg-black/90"
      )}
    >
      <div className="container mx-auto px-4 py-4 gap-4 flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>

        <ETHPriceDisplay />

        <div className="flex items-center ml-auto">
          <Button variant="link">
            <Link href="/mint">Mint</Link>
          </Button>
          <Button variant="link">Explore Marketplace</Button>
        </div>

        <WalletConnector />
      </div>
    </header>
  );
}
