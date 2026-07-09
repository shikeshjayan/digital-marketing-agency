import { put } from "@vercel/blob";

export async function uploadToBlob(buffer, filename, contentType) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set");
  }
  const blob = await put(filename, buffer, {
    contentType,
    access: "public",
    addRandomSuffix: false,
  });
  return blob.url;
}
