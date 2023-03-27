/** @format */

import type fileUpload from 'express-fileupload';
import Storage from '../Storage';

type UploadedFile = fileUpload.UploadedFile;

const MOCK_ID = 'TEST_ID';

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue({}),
    readFile: jest.fn().mockResolvedValue({}),
    mkdir: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: (function () {
    let num = 0;
    return (): string => {
      num = num + 1;
      return MOCK_ID + num;
    };
  })(),
}));

describe('Storage', (): void => {
  describe('store', (): void => {
    test('stores an image', async () => {
      const file = <UploadedFile>{
        tempFilePath: '/test/file/path/image.jpg',
        name: 'image.jpg',
        mimetype: 'image/jpg',
      };

      const imageID = await Storage.store(file);
      expect(imageID).toEqual(MOCK_ID + 1);
    });

    test('stores weird types', async () => {
      const file = <UploadedFile>{
        tempFilePath: '/test/file/path/image.aaaazzzz',
        name: 'image.aaaazzzz',
        mimetype: 'image/aaaazzzz',
      };

      const imageID = await Storage.store(file);
      expect(imageID).toEqual(MOCK_ID + 2);
    });
  });

  describe('retrieve', (): void => {
    test('fetches an image by ID', (): void => {
      const file = Storage.retrieve(MOCK_ID + 1);
      expect(file.id).toEqual(MOCK_ID + 1);
    });

    test('throws on bad ID', (): void => {
      expect(() => Storage.retrieve('.')).toThrow();
    });
  });
});
