## NFT SEA [Demo Project]

Simple demo project (Next.js, Tailwind, Shadcn UI, Wagmi, React Query) that demonstrates how to connect to a custom wallet and mint NFTs.

# Fetching Implementation Notes

### Current Implementation (Dual Approach)

The project implements two different NFT fetching strategies:

#### 1. Alchemy API Method (Primary - `useUserNFTsAlchemy`)

- Uses Alchemy's `getNFTsForOwner` endpoint
- Access to all NFTs regardless of when they were minted
- Automatic metadata resolution and caching
- Better Performance: No multiple contract calls needed
- Built-in error handling and retry logic

#### 2. Event-Based Method (Fallback - `useUserNFTs`)

- Uses blockchain events to fetch NFTs
- No external dependencies
- Full control over data fetching logic
- Works with any contract

**Limitations:**

- Block Range Limitation: Currently limited to the last 10,000 blocks (~1-2 days)
- Incomplete History: NFTs received before this block range won't be detected
- Performance: Multiple contract calls required for ownership verification
- Network Dependent: Performance varies based on RPC provider and network congestion

#### Alternative Approaches Considered

**1. ERC-721 Enumerable Extension**

- Much simpler implementation using `tokenOfOwnerByIndex()`
- Not supported by the current contract implementation

**2. The Graph Protocol**

- Decentralized indexing with GraphQL API
- Real-time updates and fast queries
- Requires subgraph deployment

**3. Other Centralized Services**

- **Moralis**: Built-in NFT queries with caching
- **Covalent**: Multi-chain support

## Quick Notes

- Uses Sepolia testnet (get some test ETH first)
- Pinata handles IPFS storage (because decentralization rocks)
- ETH price display because why not (Bandchain Oracle)
- NFT fetching: Alchemy API or Event-based fallback

## Tech Stack

Next.js 14, TypeScript, Tailwind, Wagmi, React Query, Pinata, Alchemy API

## Usage

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run development server
pnpm dev
```

## Architecture

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **Blockchain**: Wagmi for Ethereum interactions
- **State Management**: React Query for server state
- **IPFS**: Pinata for decentralized storage
- **Indexing**: Alchemy API for NFT data
- **Network**: Sepolia testnet
