/** @format */

import type { File } from './Storage';
import type { UploadedFile } from 'express-fileupload';

import _ from 'lodash';
import Storage from './Storage';

class ProgImage {
  static store(file: UploadedFile): ID {
    const id = Storage.store(file);
    return id;
  }

  static retrieve(id: ID): File {
    const file = Storage.retrieve(id);

    const toType = _.last(id.split('.'));
    if (toType == null) {
      return file;
    }

    // convert to toType from file.mimeType

    return file;
  }
}

export default ProgImage;
