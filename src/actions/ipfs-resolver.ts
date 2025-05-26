"use server";

export async function resolveIPFSUrl(ipfsUrl: string): Promise<string> {
  console.log("Resolving IPFS URL:", ipfsUrl);

  if (!ipfsUrl) {
    throw new Error("No URL provided");
  }

  // Fix malformed URLs that have both HTTP gateway and ipfs:// protocol
  if (ipfsUrl.includes("/ipfs/ipfs://")) {
    console.log("Detected malformed URL with double protocol, fixing...");

    const cidMatch = ipfsUrl.match(/ipfs:\/\/([a-zA-Z0-9]+)/);
    if (cidMatch) {
      const cid = cidMatch[1];
      // Remove trailing slash from gateway URL to prevent double slashes
      const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY!.replace(
        /\/$/,
        ""
      );
      const gatewayUrl = `${gateway}/ipfs/${cid}`;
      console.log("Fixed URL:", gatewayUrl);
      return gatewayUrl;
    }
  }

  // If it's already a resolved HTTP URL, return it
  if (ipfsUrl.startsWith("http://") || ipfsUrl.startsWith("https://")) {
    return ipfsUrl;
  }

  // If it doesn't start with ipfs://, but looks like a hash, add the prefix
  if (!ipfsUrl.startsWith("ipfs://")) {
    // Check if it looks like an IPFS hash (starts with Qm or b)
    if (
      ipfsUrl.match(
        /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|[a-z2-7]{59})$/
      )
    ) {
      ipfsUrl = `ipfs://${ipfsUrl}`;
    } else {
      throw new Error(`Invalid IPFS URL format: ${ipfsUrl}`);
    }
  }

  const cid = ipfsUrl.replace("ipfs://", "");

  // Remove trailing slash from gateway URL to prevent double slashes
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY!.replace(/\/$/, "");
  const gatewayUrl = `${gateway}/ipfs/${cid}`;

  console.log("Final gateway URL:", gatewayUrl);
  return gatewayUrl;
}

export async function fetchIPFSMetadata(ipfsUrl: string) {
  console.log("Fetching metadata for URL:", ipfsUrl);

  try {
    const resolvedUrl = await resolveIPFSUrl(ipfsUrl);
    console.log("Resolved URL:", resolvedUrl);

    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch metadata: ${response.status} - ${response.statusText}`
      );
    }

    const metadata = await response.json();
    console.log("Fetched metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error fetching IPFS metadata:", error);
    throw new Error(
      `Failed to fetch IPFS metadata: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
