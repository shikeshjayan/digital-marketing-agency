import { put } from "@vercel/blob";

export async function uploadToBlob(buffer, filename, contentType) {
  const blob = await put(filename, buffer, {
    contentType,
    access: "public",
    addRandomSuffix: false,
  });
  return blob.url;
}
