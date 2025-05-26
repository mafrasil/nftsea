import { getDefaultNetwork } from "./chains";

const ALCHEMY_NETWORKS = {
  "eth-mainnet": "https://eth-mainnet.g.alchemy.com",
  "eth-sepolia": "https://eth-sepolia.g.alchemy.com",
} as const;

type AlchemyNetwork = keyof typeof ALCHEMY_NETWORKS;

export interface AlchemyImage {
  cachedUrl?: string;
  thumbnailUrl?: string;
  pngUrl?: string;
  contentType?: string;
  size?: number;
  originalUrl?: string;
}

export interface AlchemyAnimation {
  cachedUrl?: string;
  contentType?: string;
  size?: number;
  originalUrl?: string;
}

export interface AlchemyContract {
  address: string;
  name?: string;
  symbol?: string;
  totalSupply?: string | null;
  tokenType: string;
  contractDeployer?: string;
  deployedBlockNumber?: number;
  openSeaMetadata?: {
    floorPrice?: number | null;
    collectionName?: string | null;
    collectionSlug?: string | null;
    safelistRequestStatus?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    twitterUsername?: string | null;
    discordUrl?: string | null;
    bannerImageUrl?: string | null;
    lastIngestedAt?: string | null;
  };
  isSpam?: boolean;
  spamClassifications?: string[];
}

export interface AlchemyMint {
  mintAddress?: string | null;
  blockNumber?: number | null;
  timestamp?: string | null;
  transactionHash?: string | null;
}

export interface AlchemyNFT {
  contract: AlchemyContract;
  tokenId: string;
  tokenType: string;
  name?: string | null;
  description?: string | null;
  tokenUri?: string;
  image?: AlchemyImage;
  animation?: AlchemyAnimation;
  raw?: {
    tokenUri?: string;
    metadata?: Record<string, unknown>;
    error?: string | null;
  };
  metadata?: Record<string, unknown>;
  collection?: Record<string, unknown>;
  mint?: AlchemyMint;
  owners?: Record<string, unknown>;
  timeLastUpdated?: string;
  balance?: string;
  acquiredAt?: {
    blockTimestamp?: string | null;
    blockNumber?: number | null;
  };
}

export interface AlchemyNFTsResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  pageKey?: string;
  validAt?: {
    blockNumber: number;
    blockHash: string;
    blockTimestamp: string;
  };
}

export type AlchemyNFTMetadataResponse = AlchemyNFT;

interface AlchemyConfig {
  network: AlchemyNetwork;
  apiKey: string;
}

class AlchemyAPI {
  private config: AlchemyConfig;

  constructor(network: AlchemyNetwork, apiKey: string) {
    this.config = { network, apiKey };
  }

  private getBaseUrl(version: "v2" | "v3" = "v3"): string {
    return `${ALCHEMY_NETWORKS[this.config.network]}/${version}/${
      this.config.apiKey
    }`;
  }

  private getNFTBaseUrl(version: "v3" = "v3"): string {
    return `${ALCHEMY_NETWORKS[this.config.network]}/nft/${version}/${
      this.config.apiKey
    }`;
  }

  // NFT Methods
  async getNFTsForOwner(
    owner: string,
    options: {
      contractAddresses?: string[];
      withMetadata?: boolean;
      pageSize?: number;
      pageKey?: string;
    } = {}
  ): Promise<AlchemyNFTsResponse> {
    const params = new URLSearchParams({
      owner,
      withMetadata: String(options.withMetadata ?? true),
      pageSize: String(options.pageSize ?? 100),
    });

    if (options.contractAddresses) {
      options.contractAddresses.forEach((addr) => {
        params.append("contractAddresses[]", addr);
      });
    }

    if (options.pageKey) {
      params.append("pageKey", options.pageKey);
    }

    const url = `${this.getNFTBaseUrl()}/getNFTsForOwner?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Alchemy API error: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  }

  async getNFTMetadata(
    contractAddress: string,
    tokenId: string
  ): Promise<AlchemyNFTMetadataResponse> {
    const url = `${this.getNFTBaseUrl()}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Alchemy API error: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  }

  getRpcUrl(): string {
    return `${this.getBaseUrl("v2")}`;
  }
}

export const alchemy = new AlchemyAPI(
  getDefaultNetwork(),
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!
);
