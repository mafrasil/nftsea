"use client";

import { getCachedIPFSMetadata } from "@/app/actions/cached-ipfs";
import { NFTMetadata } from "@/types/nft";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import NFT_ABI from "../abis/Musharka721.json";

interface UserNFT {
  tokenId: string;
  tokenURI: string;
  metadata?: NFTMetadata;
}

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

      // Get user's NFT balance
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

      // Reduce block range for faster queries
      const blockNumber = await publicClient.getBlockNumber();
      const fromBlock = blockNumber - BigInt(5000); // Reduced from 10k to 5k

      console.log(`🔍 Checking ${5000} blocks for Transfer events`);

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
