import { Router, Request, Response } from 'express';
import { minio, BUCKET } from '../lib/minio';

const router: Router = Router();

// GET /storage/:filename
router.get('/:filename(*)', async (req: Request, res: Response) => {
  // Handle URL-encoded filenames (e.g., "messages/abc-123.pdf")
  const filename = decodeURIComponent(req.params.filename);
  
  try {
    // Get object metadata to retrieve Content-Type
    const stat = await minio.statObject(BUCKET, filename);
    
    // MinIO stores metadata in various formats - check all possible keys
    // Note: MinIO might normalize metadata keys to lowercase
    let contentType = 'application/octet-stream';
    
    if (stat.metaData) {
      // Try different possible metadata key formats
      contentType = stat.metaData['content-type'] || 
                    stat.metaData['Content-Type'] ||
                    stat.metaData['ContentType'] ||
                    Object.values(stat.metaData).find((val: any) => 
                      typeof val === 'string' && val.includes('/')
                    ) as string || 'application/octet-stream';
      
      // Also check if it's in the headers or response headers
      if (!contentType || contentType === 'application/octet-stream') {
        // Try to infer from file extension if metadata not available
        if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
          contentType = 'image/jpeg';
        } else if (filename.endsWith('.png')) {
          contentType = 'image/png';
        } else if (filename.endsWith('.gif')) {
          contentType = 'image/gif';
        } else if (filename.endsWith('.pdf')) {
          contentType = 'application/pdf';
        } else if (filename.endsWith('.mp4')) {
          contentType = 'video/mp4';
        } else if (filename.endsWith('.webm')) {
          contentType = 'video/webm';
        } else if (filename.endsWith('.mp3')) {
          contentType = 'audio/mpeg';
        } else if (filename.endsWith('.webm') && filename.includes('audio')) {
          contentType = 'audio/webm';
        }
      }
    }
    
    // Set proper headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);
    
    // Add CORS headers if needed
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Get object stream
    const stream = await minio.getObject(BUCKET, filename);
    
    // Handle stream errors
    stream.on('error', (err: Error) => {
      console.error('Stream error for', filename, ':', err);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found' });
      }
    });
    
    // Pipe stream to response
    stream.pipe(res);
    
  } catch (err: any) {
    console.error('Error getting object:', filename, err);
    if (!res.headersSent) {
      res.status(404).json({ message: 'File not found', error: err.message });
    }
  }
});

export default router;
