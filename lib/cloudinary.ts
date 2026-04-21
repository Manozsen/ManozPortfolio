const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "portfolio");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

export async function uploadMultipleToCloudinary(
  files: File[]
): Promise<string[]> {
  const results = await Promise.all(files.map((f) => uploadToCloudinary(f)));
  return results.map((r) => r.url);
}
