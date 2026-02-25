/**
 * Client-side Supabase Storage utilities.
 *
 * These run in the browser and upload directly to Supabase Storage,
 * avoiding the network round-trip through the Next.js server process
 * which may be blocked by firewalls or ISP restrictions.
 */

import { supabase } from "@/lib/supabase";

type UploadSuccess = { success: true; data: { path: string; publicUrl: string } };
type UploadFailure = { success: false; error: string };
type UploadResult = UploadSuccess | UploadFailure;

export async function uploadStepImageClient(file: File): Promise<UploadResult> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `steps/${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("step-image")
      .upload(fileName, file, { upsert: false, cacheControl: "3600" });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("step-image").getPublicUrl(data.path);

    return { success: true, data: { path: data.path, publicUrl } };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function deleteStepImageClient(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!imageUrl) return { success: false, error: "No image URL provided" };

    const urlParts = imageUrl.split("/storage/v1/object/public/step-image/");
    if (urlParts.length < 2) return { success: false, error: "Invalid image URL" };

    const filePath = urlParts[1];
    const { error } = await supabase.storage.from("step-image").remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, error: "Failed to delete image" };
  }
}
