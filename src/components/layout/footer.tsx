import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "../ui/logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/90 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center text-sm space-x-4">
            <span className="text-gray-400">
              NFT Sea {year} © All right reserved
            </span>
            <Button variant="gradient">Explore Marketplace</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
