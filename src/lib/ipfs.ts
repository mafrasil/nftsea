export const resolveIPFSUrl = (ipfsUrl: string): string => {
  if (!ipfsUrl) return "";

  // If it's already a resolved HTTP URL, return it
  if (ipfsUrl.startsWith("http://") || ipfsUrl.startsWith("https://")) {
    return ipfsUrl;
  }

  // Handle ipfs:// protocol
  if (ipfsUrl.startsWith("ipfs://")) {
    const cid = ipfsUrl.replace("ipfs://", "");
    // Remove trailing slash from gateway URL to prevent double slashes
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY!.replace(/\/$/, "");
    return `${gateway}/ipfs/${cid}`;
  }

  // If it looks like a raw CID, add ipfs:// prefix and resolve
  if (
    ipfsUrl.match(
      /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|[a-z2-7]{59})$/
    )
  ) {
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY!.replace(/\/$/, "");
    return `${gateway}/ipfs/${ipfsUrl}`;
  }

  return ipfsUrl;
};
