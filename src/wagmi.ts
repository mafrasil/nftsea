import { alchemy } from "@/lib/alchemy";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [sepolia],
    connectors: [metaMask(), coinbaseWallet()],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [sepolia.id]: http(alchemy.getRpcUrl()),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
