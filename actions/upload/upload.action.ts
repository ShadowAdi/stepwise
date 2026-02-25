'use server'

import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * Extracts the UploadThing file key from a ufsUrl or utfs.io URL.
 * URL formats:
 *   https://ufs.uploadthing.com/f/<key>
 *   https://<app>.ufs.sh/f/<key>
 *   https://utfs.io/f/<key>
 */
function getFileKey(url: string): string | null {
  const match = url.match(/\/f\/([^/?#]+)/);
  return match ? match[1] : null;
}

export async function deleteStepImage(imageUrl: string) {
  try {
    if (!imageUrl) return { success: false, error: 'No image URL provided' };

    const key = getFileKey(imageUrl);
    if (!key) return { success: false, error: 'Could not extract file key from URL' };

    await utapi.deleteFiles(key);
    return { success: true, data: { message: 'Image deleted successfully' } };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}