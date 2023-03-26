/** @format */

import type fileUpload from 'express-fileupload';

import { v4 as uuid } from 'uuid';
import fs from 'fs';

type UploadedFile = fileUpload.UploadedFile;

export type File = {
  id: ID;
  mimeType: string;
  path: string;
};

/**
 * Deals with the storing and the retrieval of the image
 */
class Storage {
  collection: { [key in ID]: File } = {
    'b7126cfd-3ce3-45bf-9960-b08eeb7309f9': {
      id: 'b7126cfd-3ce3-45bf-9960-b08eeb7309f9',
      mimeType: 'image/png',
      path: `${__dirname}/uploads/837153.png`,
    },
  };

  /**
   * Takes an image, stores it and returns the ID
   */
  store(image: UploadedFile): ID {
    const id = uuid();

    fs.readFile(image.tempFilePath, (_: Error, data: Buffer) => {
      const newPath = `${__dirname}/uploads/${image.name}`;
      fs.writeFile(newPath, data, (err: Error): void => {
        if (err) {
          console.warn(err);
        }
      });

      const file = {
        id,
        mimeType: image.mimetype,
        path: newPath,
      };
      this.collection[id] = file;
    });

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
