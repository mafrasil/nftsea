"use server";

import { PinataSDK } from "pinata";
import { validateAndCreateMetadata } from "./metadata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export async function uploadImageToIPFS(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const upload = await pinata.upload.public.file(file);
    const cleanURL = `ipfs://${upload.cid}`;
    console.log("Image uploaded to IPFS:", cleanURL);
    return cleanURL;
  } catch (error) {
    console.error("Failed to upload image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
}

export async function uploadJSONToIPFS(
  metadata: Record<string, unknown>
): Promise<string> {
  try {
    const upload = await pinata.upload.public.json(metadata);
    const cleanURL = `ipfs://${upload.cid}`;
    console.log("JSON uploaded to IPFS:", cleanURL);
    return cleanURL;
  } catch (error) {
    console.error("Failed to upload metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

export async function uploadMetadataToIPFS(
  title: string,
  description: string,
  imageIPFSUrl: string,
  customAttributes?: Array<{ trait_type: string; value: string }>
): Promise<string> {
  console.log("🔍 DEBUG: Creating metadata with imageIPFSUrl:", imageIPFSUrl);

  const validatedMetadata = await validateAndCreateMetadata(
    title,
    description,
    imageIPFSUrl,
    customAttributes
  );

  try {
    const upload = await pinata.upload.public.json(validatedMetadata);
    const cleanURL = `ipfs://${upload.cid}`;
    console.log("Metadata uploaded to IPFS:", cleanURL);
    return cleanURL;
  } catch (error) {
    console.error("Failed to upload metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}
