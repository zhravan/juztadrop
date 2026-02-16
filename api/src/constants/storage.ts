export const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB
export const BUCKET_NAME = 'assets';

export const FILE_CLASSES = {
  avatars: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  org_logos: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  },
  documents: {
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  opportunity_media: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
} as const;

export type FileClass = keyof typeof FILE_CLASSES;
export const FILE_CLASS_VALUES = Object.keys(FILE_CLASSES) as FileClass[];
