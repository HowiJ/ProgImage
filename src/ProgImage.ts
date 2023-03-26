/** @format */

import type { File } from './Storage';
import type { UploadedFile } from 'express-fileupload';

import Jimp from 'jimp';
import _ from 'lodash';
import Storage, { BASE_PATH } from './Storage';

const supportedFileTypes = new Set(['jpg', 'png', 'bmp', 'tiff']);

/**
 * ProgImage
 *
 * Call ProgImage.store and ProgImage.retrieve to do such
 */
class ProgImage {
  /**
   * Stores the passed file into the storage system
   *
   * This doesn't do too much but since ProgImage is our
   * Front-facing API, it's okay.
   * @param file Uploaded File, see express-fileupload
   * @returns Promise<ID>
   */
  static async store(file: UploadedFile): Promise<ID> {
    return await Storage.store(file);
  }

  /**
   * Retrieves an image based on the passed ID, if the ID has an extension,
   * it sends the image back with that extension IE 123.jpg would return 123 as a jpg
   * @param id ID
   * @returns Promise<File> Custom file type that contains ID, Mime type, and path
   */
  static async retrieve(id: ID): Promise<File> {
    const [fileID, toType] = id.split('.');
    const file = Storage.retrieve(fileID);

    if (toType == null) {
      return file;
    }
    if (!supportedFileTypes.has(toType)) {
      throw new Error(`Unsupported File Type ${toType}`);
    }

    return await ProgImage.convert(id, file, toType);
  }

  /**
   *
   * @param id UUID of the file
   * @param file File details
   * @param toType extension of file
   * @returns Promise<File> of the converted Image
   */
  private static async convert(
    id: ID,
    file: File,
    toType: string
  ): Promise<File> {
    const path = `${BASE_PATH}${id}`;
    const jimpFile = await Jimp.read(file.path);
    await jimpFile.writeAsync(path);

    return {
      id,
      mimeType: `image/${toType}`,
      path,
    };
  }
}

export default ProgImage;
