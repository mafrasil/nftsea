"use server";

import sharp from "sharp"; // You'll need to install this: npm install sharp

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_DIMENSIONS = { width: 2048, height: 2048 };

export async function validateAndProcessImage(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size too large. Maximum 10MB allowed.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(buffer).metadata();

    // Validate dimensions
    if (
      metadata.width! > MAX_DIMENSIONS.width ||
      metadata.height! > MAX_DIMENSIONS.height
    ) {
      // Resize if too large
      const resizedBuffer = await sharp(buffer)
        .resize(MAX_DIMENSIONS.width, MAX_DIMENSIONS.height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      return new File([resizedBuffer], file.name, { type: "image/jpeg" });
    }

    return file;
  } catch (error) {
    throw new Error("Invalid image file");
  }
}
