"use server";

import { unstable_cache } from "next/cache";
import { fetchIPFSMetadata } from "./ipfs-resolver";

export const getCachedIPFSMetadata = unstable_cache(
  async (ipfsUrl: string) => {
    console.log("🌐 Fetching fresh metadata for:", ipfsUrl);
    return await fetchIPFSMetadata(ipfsUrl);
  },
  ["ipfs-metadata"],
  {
    revalidate: 300, // 5 minutes
    tags: ["ipfs-metadata"],
  }
);
