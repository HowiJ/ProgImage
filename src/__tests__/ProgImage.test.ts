/** @format */

import type fileUpload from 'express-fileupload';
import type { File } from '../Storage';

import ProgImage from '../ProgImage';

type UploadedFile = fileUpload.UploadedFile;

const MOCK_ID = 'TEST_ID';
const MOCK_FILE = <UploadedFile>{
  tempFilePath: '/test/file/path/image.jpg',
  name: 'image.jpg',
  mimetype: 'image/jpg',
};

const MOCK_INTERNAL_FILE = <File>{
  id: MOCK_ID + 1,
  mimeType: MOCK_FILE.mimetype,
  path: MOCK_FILE.tempFilePath,
};

jest.mock('../Storage', () => ({
  retrieve: () => MOCK_INTERNAL_FILE,
  store: (function () {
    let num = 0;
    return (): string => {
      num = num + 1;
      return MOCK_ID + num;
    };
  })(),
}));

jest.mock('jimp', () => ({
  read: async (path: string) => ({
    writeAsync: async (path: string) => '',
  }),
}));

describe('ProgImage', (): void => {
  describe('store', (): void => {
    test('stores a file successfully', async () => {
      const id = await ProgImage.store(MOCK_FILE);
      expect(id).toEqual(MOCK_ID + 1);
    });

    test('throws on unsupported filetypes', () => {
      const file = {
        ...MOCK_FILE,
        name: 'abc.abcabcabc',
      };

      ProgImage.store(file).catch((e) => {
        expect(e).not.toBeNull();
      });
    });
  });

  describe('retrieve', (): void => {
    test('retrieves file without extension', async () => {
      const id = MOCK_ID + 1;
      const file = await ProgImage.retrieve(id);

      expect(file.id).toBe(MOCK_ID + 1);
      expect(file.path.split('.')[1]).toBe('jpg');
    });

    test('retrieves file with correct extension', async () => {
      const id = MOCK_ID + 1;
      const file = await ProgImage.retrieve(id + '.png');

      expect(file.path.split('.')[1]).toBe('png');
    });
  });
});
