"use client";

import { getCachedIPFSMetadata } from "@/actions/cached-ipfs";
import { alchemy, type AlchemyNFT } from "@/lib/alchemy";
import { NFTMetadata } from "@/types/nft";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import NFT_ABI from "../abis/Musharka721.json";

interface UserNFT {
  tokenId: string;
  tokenURI: string;
  metadata?: NFTMetadata;
}

/*
 * Original Method: based on blockchain events, slower, limited to 10k blocks (1-2 days of data)
 */
export function useUserNFTs() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-nfts", address?.toLowerCase() || "disconnected"],
    queryFn: async () => {
      if (!address || !isConnected || !publicClient) {
        return { nfts: [], balance: 0 };
      }
      if (!data) console.log("🔄 Fetching NFTs for", address);

      const userBalance = await publicClient.readContract({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: NFT_ABI.abi,
        functionName: "balanceOf",
        args: [address],
      });

      const balanceNum = Number(userBalance);
      if (balanceNum === 0) {
        return { nfts: [], balance: 0 };
      }

      const blockNumber = await publicClient.getBlockNumber();
      const fromBlock = blockNumber - BigInt(10_000);

      console.log(`🔍 Checking ${10_000} blocks for Transfer events`);

      const transferEvents = await publicClient.getLogs({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        event: {
          type: "event",
          name: "Transfer",
          inputs: [
            { type: "address", indexed: true, name: "from" },
            { type: "address", indexed: true, name: "to" },
            { type: "uint256", indexed: true, name: "tokenId" },
          ],
        },
        args: { to: address },
        fromBlock,
        toBlock: "latest",
      });

      console.log(`📊 Found ${transferEvents.length} transfer events`);

      // Process events in parallel instead of sequentially
      const nftPromises = transferEvents.map(async (event) => {
        try {
          const tokenId = event.args.tokenId as bigint;

          // Verify ownership
          const owner = (await publicClient.readContract({
            address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
            abi: NFT_ABI.abi,
            functionName: "ownerOf",
            args: [tokenId],
          })) as string;

          if (owner.toLowerCase() !== address.toLowerCase()) return null;

          const tokenURI = (await publicClient.readContract({
            address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
            abi: NFT_ABI.abi,
            functionName: "tokenURI",
            args: [tokenId],
          })) as string;

          const metadata = await getCachedIPFSMetadata(tokenURI);
          return {
            tokenId: tokenId.toString(),
            tokenURI,
            metadata: metadata as NFTMetadata,
          };
        } catch (error) {
          console.error("Error processing token:", error);
          return null;
        }
      });

      const results = await Promise.all(nftPromises);
      const userNfts = results.filter(Boolean) as UserNFT[];

      console.log(`✅ Processed ${userNfts.length} NFTs`);
      return { nfts: userNfts, balance: balanceNum };
    },
    enabled: !!address && isConnected && !!publicClient,
  });

  return {
    nfts: data?.nfts || [],
    balance: data?.balance || 0,
    loading: isLoading,
    error,
  };
}

/*
 * New Method: based on Alchemy API
 */
export function useUserNFTsAlchemy() {
  const { address } = useAccount();

  const query = useQuery({
    queryKey: ["user-nfts-alchemy", address],
    queryFn: async (): Promise<UserNFT[]> => {
      if (!address) return [];

      const contractAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not configured");
      }

      const data = await alchemy.getNFTsForOwner(address, {
        contractAddresses: [contractAddress],
        withMetadata: true,
        pageSize: 100,
      });

      return data.ownedNfts.map((nft: AlchemyNFT): UserNFT => {
        let metadata: NFTMetadata | undefined = undefined;

        // 1. Check if Alchemy provided metadata at the top level
        if (nft.metadata && Object.keys(nft.metadata).length > 0) {
          metadata = nft.metadata as unknown as NFTMetadata;
        }
        // 2. Check raw.metadata
        else if (
          nft.raw?.metadata &&
          Object.keys(nft.raw.metadata).length > 0
        ) {
          metadata = nft.raw.metadata as unknown as NFTMetadata;
        }
        // 3. Build metadata from individual fields if available
        else if (nft.name || nft.description) {
          metadata = {
            name: nft.name || "",
            description: nft.description || "",
            image: nft.image?.originalUrl || nft.image?.cachedUrl || "",
          };
        }

        return {
          tokenId: nft.tokenId,
          tokenURI: nft.tokenUri || nft.raw?.tokenUri || "",
          metadata,
        };
      });
    },
    enabled: !!address,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  return {
    nfts: query.data || [],
    loading: query.isLoading,
    balance: query.data?.length || 0,
    error: query.error,
    refetch: query.refetch,
  };
}
