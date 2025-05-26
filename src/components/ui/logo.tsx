import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={cn("text-3xl font-bold font-cinzel", className)}>
      NFT{" "}
      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-clip font-cinzel text-transparent bg-clip-text">
        Sea
      </span>
    </span>
  );
};

export default Logo;
