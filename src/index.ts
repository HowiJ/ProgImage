/** @format */

import { assert } from 'console';
import type { Request, Response } from 'express';

import express from 'express';
import fileUpload from 'express-fileupload';
import ProgImage from './ProgImage';

type UploadedFile = fileUpload.UploadedFile;

const app = express();
const PORT = 8000;

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

/**
 * Root, not needed
 */
app.get('/', (_: Request, res: Response): void => {
  res.send('ProgImage');
});

/**
 * POST /image
 * Stores the image and then returns the ID afterwards
 */
app.post('/image', (req: Request, res: Response): void => {
  const file = <UploadedFile>Object.values(req.files)[0];
  console.log(file);

  if (file != null) {
    const id = ProgImage.store(file);
    res.json({ id });
    return;
  }

  res.send('No file found');
});

/**
 * GET image?id=ID_OF_FILE
 * Retrieves an image based on the ID passed in
 */
app.get('/image', (req: Request, res: Response): void => {
  console.log(req.query);
  const fileID = req.query.id;
  if (fileID == null) {
    res.json({ error: 'Image with id not found' });
    return;
  }
  assert(typeof fileID === 'string');
  const image = ProgImage.retrieve(<string>fileID);
  res.sendFile(image.path);
});

app.listen(PORT, (): void => {
  console.log(`ProgImage on port ${PORT}`);
});
