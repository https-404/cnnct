import { Client } from 'minio';

const ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const BUCKET = process.env.MINIO_BUCKET || 'chatapp-media';

const u = new URL(ENDPOINT);

export const minio = new Client({
  endPoint: u.hostname,
  port: Number(u.port || (u.protocol === 'https:' ? 443 : 80)),
  useSSL: u.protocol === 'https:',
  accessKey: process.env.MINIO_ROOT_USER || process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export async function ensureBucket() {
  const exists = await minio.bucketExists(BUCKET).catch(() => false);
  if (!exists) {
    await minio.makeBucket(BUCKET, 'us-east-1').catch(err => {
      console.error('Error creating bucket:', err);
      throw new Error('Failed to create MinIO bucket');
    });
  }
}

/** Build a public URL (works if bucket/objects are public or behind a proxy) */
export function objectUrl(objectName: string) {
  const base = ENDPOINT.replace(/\/+$/, ''); // trim trailing slash
  return `${base}/${BUCKET}/${objectName}`;
}

/** Upload a buffer and return the URL */
export async function putBuffer(objectName: string, buf: Buffer, contentType: string) {
  await ensureBucket();
  await minio.putObject(BUCKET, objectName, buf, buf.length, { 'Content-Type': contentType });
  return objectUrl(objectName);
}

export { BUCKET };
