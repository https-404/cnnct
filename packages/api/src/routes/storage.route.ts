import { Router, Request, Response } from 'express';
import { minio, BUCKET } from '../lib/minio';

const router: Router = Router();

// GET /storage/:filename
router.get('/:filename', async (req: Request, res: Response) => {
  const { filename } = req.params;
  try {
    const stream = await minio.getObject(BUCKET, filename);
    stream.on('error', err => {
      res.status(404).json({ message: 'File not found' });
    });
    stream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: 'File not found' });
  }
});

export default router;
