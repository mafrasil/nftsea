import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import NFT_ABI from "../abis/Musharka721.json";

export const useNFTMint = () => {
  const { writeContractAsync, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (to: string, uri: string) => {
    const cid = uri.replace("ipfs://", "");
    const hash = await writeContractAsync({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
      abi: NFT_ABI.abi,
      functionName: "mint",
      args: [to, cid],
    });

    return hash;
  };

  return { mint, isConfirming, isSuccess, hash, error };
};

export const useContractBaseURI = () => {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: NFT_ABI.abi,
    functionName: "baseURI",
  });
};
