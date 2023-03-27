/** @format */

import { assert } from 'console';
import type { Request, Response } from 'express';

import express from 'express';
import fileUpload from 'express-fileupload';
import lodash from 'lodash';

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
app.use(express.urlencoded({ extended: true }));

/**
 * Root, not needed
 */
app.get('/', (_: Request, res: Response): void => {
  res.send(
    '<form method="get" action="/image"><input type="text" name="id" /><input type="submit" /></form>'
  );
});

/**
 * POST /image
 * Stores the image and then returns the ID afterwards
 */
app.post('/image', async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  console.log(req.files);
  let file = null;
  try {
    file = <UploadedFile>lodash.first(Object.values(req.files));
  } catch (e) {
    res.status(400).json({ error: 'File is required but not found' });
    return;
  }
  if (file != null) {
    try {
      const id = await ProgImage.store(file);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: 'No file found' });
  }
});

/**
 * GET image?id=ID_OF_FILE
 * Retrieves an image based on the ID passed in
 */
app.get('/image', async (req: Request, res: Response): Promise<void> => {
  const fileID = req.query.id;
  if (fileID == null) {
    res.status(400).json({ error: `Image ID not specified` });
    return;
  }

  if (typeof fileID !== 'string') {
    res.status(501).json({ error: 'ID must be of type string' });
  }
  try {
    const file = await ProgImage.retrieve(<string>fileID);
    res.status(200).sendFile(file.path);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, (): void => {
  console.log(`ProgImage on port ${PORT}`);
});
