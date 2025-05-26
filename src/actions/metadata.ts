"use server";

import { z } from "zod";

const NFTMetadataSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(1000).trim(),
  image: z.string().startsWith("ipfs://"),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
        display_type: z
          .enum(["number", "boost_percentage", "boost_number", "date"])
          .optional(),
      })
    )
    .optional(),
});

export async function validateAndCreateMetadata(
  title: string,
  description: string,
  imageIPFSUrl: string,
  customAttributes?: Array<{ trait_type: string; value: string }>
) {
  try {
    const sanitizedData = {
      name: title.trim(),
      description: description.trim(),
      image: imageIPFSUrl.trim(),
    };

    const attributes: { trait_type: string; value: string }[] = [];

    if (customAttributes && customAttributes.length > 0) {
      customAttributes.forEach((attr) => {
        if (attr.trait_type.trim() && attr.value.trim()) {
          attributes.push({
            trait_type: attr.trait_type.trim(),
            value: attr.value.trim(),
          });
        }
      });
    }

    const validatedMetadata = NFTMetadataSchema.parse({
      ...sanitizedData,
      attributes,
    });

    return {
      ...validatedMetadata,
      created_at: new Date().toISOString(),
      creator: "NFT Sea Platform",
      version: "1.0",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw new Error("Failed to create metadata");
  }
}
