import { getApiErrorMessage } from '@/lib/api-proxy';

/**
 * Upload a file to Supabase Storage via the storage API.
 * Returns { url, assetKey } for storing in the database.
 */
export async function uploadToStorage(
  file: File,
  fileClass: 'avatars' | 'org_logos' | 'documents' | 'opportunity_media'
): Promise<{ url: string; assetKey: string }> {
  const formData = new FormData();
  formData.append('file_class', fileClass);
  formData.append('file', file);

  const res = await fetch('/api/storage', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(getApiErrorMessage(data, 'Upload failed'));
  }

  const result = data?.data ?? data;
  if (!result?.assetKey || !result?.url) {
    throw new Error('Invalid upload response');
  }
  return { url: result.url, assetKey: result.assetKey };
}
