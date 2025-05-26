export const CHAIN_ID_TO_NETWORK = {
  1: "eth-mainnet",
  11155111: "eth-sepolia",
} as const;

export const NETWORK_TO_CHAIN_ID = {
  "eth-mainnet": 1,
  "eth-sepolia": 11155111,
} as const;

export type ChainId = keyof typeof CHAIN_ID_TO_NETWORK;
export type NetworkName = keyof typeof NETWORK_TO_CHAIN_ID;

export const chainIdToNetwork = (chainId: number): NetworkName | null => {
  return CHAIN_ID_TO_NETWORK[chainId as ChainId] || null;
};

export const networkToChainId = (network: NetworkName): number | null => {
  return NETWORK_TO_CHAIN_ID[network] || null;
};

export const getChainDisplayName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 11155111:
      return "Sepolia Testnet";
    default:
      return `Chain ${chainId}`;
  }
};

export const isSupportedChain = (chainId: number): boolean => {
  return chainId in CHAIN_ID_TO_NETWORK;
};

export const getDefaultNetwork = (): NetworkName => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1");
  const network = chainIdToNetwork(chainId);

  if (!network) {
    console.warn(
      `Unsupported chain ID: ${chainId}, falling back to eth-mainnet`
    );
    return "eth-mainnet";
  }

  return network;
};

export const getAlchemyNetworkForChain = (
  chainId: number
): NetworkName | null => {
  return chainIdToNetwork(chainId);
};
