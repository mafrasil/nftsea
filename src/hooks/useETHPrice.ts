"use client";

import { getETHPrice } from "@/actions/price";
import { useQuery } from "@tanstack/react-query";

export function useETHPrice() {
  return useQuery({
    queryKey: ["eth-price"],
    queryFn: getETHPrice,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
