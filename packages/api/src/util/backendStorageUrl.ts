import axios from 'axios';

// Utility to convert a minio object name to the backend storage URL
export function backendStorageUrl(objectName: string) {
  // Assuming backend runs at http://localhost:3000 and serves at /api/storage/:filename
  return `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/storage/${objectName}`;
}

