"use server";

import { unstable_cache } from "next/cache";

const getCachedETHPrice = unstable_cache(
  async (): Promise<number> => {
    try {
      const api =
        "https://laozi1.bandchain.org/api/oracle/v1/request_prices?symbols=ETH";
      const result = await fetch(api);

      if (!result.ok) {
        throw new Error(`Failed to fetch ETH price: ${result.status}`);
      }

      const data = await result.json();
      const price = data.price_results[0].px / data.price_results[0].multiplier;

      console.log("📈 Fetched ETH price:", price);
      return price;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      throw new Error("Failed to fetch ETH price");
    }
  },
  ["eth-price"],
  {
    revalidate: 300,
  }
);

export async function getETHPrice(): Promise<number> {
  return getCachedETHPrice();
}
