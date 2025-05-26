## NFT SEA [Demo Project]

Simple demo project (Next.js, Tailwind, Shadcn UI, Wagmi, React Query) that demonstrates how to connect to a custom wallet and mint NFTs.

# Fetching Implementation Notes

### Current Implementation: Event-Based Fetching

`useUserNFTs` hook implements NFT fetching by querying blockchain Transfer events (approach was chosen due to limitations in the ERC-721 standard and the specific contract implementation)

#### Known Limitations

- **Block Range Limitation**: Currently limited to the last 10,000 blocks
- **Incomplete History**: NFTs received before this block range won't be detected
- **Performance**: Multiple contract calls required for ownership verification + performance varies based on RPC provider and network congestion

#### Alternative Approaches Considered

**1. ERC-721 Enumerable Extension**

Much simpler implementation using `tokenOfOwnerByIndex()`, but not supported by the current contract implementation

**2. The Graph Protocol**

Decentralized indexing, fast queries, real-time updates, GraphQL API

**3. Centralized Indexing Services**

- **Alchemy NFT API**: `alchemy.nft.getNftsForOwner()`
- **Moralis**: Built-in NFT queries with caching

#### Current Implementation Rationale

The event-based approach was implemented to:

- Demonstrate understanding of blockchain event querying
- Avoid external API dependencies
- Work with any ERC-721 contract (not requiring Enumerable extension)
- Maintain full control over the data fetching logic
