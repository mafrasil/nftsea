import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "../ui/logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/90 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center text-sm space-y-2 md:space-y-0 md:space-x-4">
            <span className="text-gray-400 text-center md:text-left">
              NFT Sea {year} © All right reserved
            </span>
            <Button variant="gradient" className="w-full md:w-auto">
              Explore Marketplace
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
