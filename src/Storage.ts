/** @format */

import type fileUpload from 'express-fileupload';

import { v4 as uuid } from 'uuid';
import fs from 'fs';
import lodash from 'lodash';

const fsAsync = fs.promises;

type UploadedFile = fileUpload.UploadedFile;

export type File = {
  id: ID;
  mimeType: string;
  path: string;
};

export const BASE_PATH = `${__dirname}/uploads/`;

/**
 * Deals with the storing and the retrieval of files
 * Currently just storing in memory but if we were to use
 * a storage type such as mongodb, we would implement it here.
 *
 * Images are stored in fileSystem and instead can be changed to
 * storing in aws or something instead. Mongodb would just store the
 * pathways of the images.
 */
class Storage {
  collection: { [key in ID]: File } = {};

  /**
   * Takes an image, stores it and returns the ID
   */
  async store(image: UploadedFile): Promise<ID> {
    const id = uuid();

    const data = await fsAsync.readFile(image.tempFilePath);
    const ext = lodash.last(image.name.split('.'));
    await fsAsync.mkdir(`${__dirname}/uploads`, { recursive: true });
    const newPath = `${__dirname}/uploads/${id}.${ext}`;
    await fsAsync.writeFile(newPath, data);

    const file = {
      id,
      mimeType: image.mimetype,
      path: newPath,
    };
    this.collection[id] = file;

    return id;
  }

  /**
   * Retrieves an image based on ID
   */
  retrieve(id: ID): File {
    const file = this.collection[id];
    if (file == null) {
      throw new Error(`File not found with ID ${id}`);
    }
    return file;
  }
}

const storage = new Storage();

export default storage;
