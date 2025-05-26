"use client";

import { Button } from "@/components/ui/button";
import { WalletConnector } from "@/components/wallet";
import { useETHPrice } from "@/hooks/useETHPrice";
import { cn } from "@/lib/utils";
import { Loader2, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

        {/* ETH Price - Hidden on mobile */}
        <div className="hidden sm:block">
          <ETHPriceDisplay />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center ml-auto">
          <Button variant="link">
            <Link href="/mint">Mint</Link>
          </Button>
          <Button variant="link">Explore Marketplace</Button>
        </div>

        {/* Desktop Wallet Connector */}
        <div className="hidden md:block">
          <WalletConnector />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile ETH Price */}
            <div className="sm:hidden">
              <ETHPriceDisplay />
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              <Button
                variant="link"
                className="justify-start"
                onClick={closeMobileMenu}
              >
                <Link href="/mint">Mint</Link>
              </Button>
              <Button
                variant="link"
                className="justify-start"
                onClick={closeMobileMenu}
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Mobile Wallet Connector */}
            <div className="pt-2 border-t border-gray-800">
              <WalletConnector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
