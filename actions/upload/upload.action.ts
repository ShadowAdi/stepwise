'use server'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadStepImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `steps/${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from('step-image')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('step-image')
      .getPublicUrl(data.path);

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrl
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}
