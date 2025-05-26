import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import NFT_ABI from "../abis/Musharka721.json";

export const useNFTMint = () => {
  const { writeContractAsync, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (to: string, uri: string) => {
    try {
      const hash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: NFT_ABI.abi,
        functionName: "mint",
        args: [to, uri],
      });
      return hash;
    } catch (error) {
      // This will catch user rejection and other errors
      throw error;
    }
  };

  return { mint, isConfirming, isSuccess, hash, error };
};
