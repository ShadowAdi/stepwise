'use server'

import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function deleteStepImage(imageUrl: string) {
  try {
    if (!imageUrl) {
      return {
        success: false,
        error: 'No image URL provided'
      };
    }

    const urlParts = imageUrl.split("/storage/v1/object/public/step-image/")
    if (urlParts.length < 2) {
      return {
        success: false,
        error: 'Invalid image URL'
      }
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage.from("step-image").remove([filePath])

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: { message: 'Image deleted successfully' }
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'Failed to delete image'
    };
  }
}

export async function uploadStepImage(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        error: "No File Found"
      }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `steps/${crypto.randomUUID()}.${fileExt}`

    const { data, error } = await supabaseAdmin.storage.from("step-image").upload(fileName, file, {
      upsert: false,
      cacheControl: "3600"
    })

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from("step-image").getPublicUrl(data.path)

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrl
      }
    };
  } catch (error) {
    console.error(`Upload error: `, error)
    return {
      success: false,
      error: "Failed to upload image"
    }
  }
}