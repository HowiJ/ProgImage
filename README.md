# ProgImage
## Setup Instructions
### Setup
1. `npm install` to install dependencies
2. `npm start` to start server

### Manual Build
* `npm run build` if you would want to manually run build

## Testing
### Manual Testing
* See Routes, `POST /images` will return you the ID of the image

### Jest Tests
1. `npm run test`
2. This should run all tests that follow the convention of `*.test.js`
* This may not work if `find` doesn't work
* If so, all tests are currently in `src/__tests__`

## Instructions for Use
### Web
`localhost:8000` will take you to a primitive website to search for images based on ID
This is not very built out so there's much to be desired.

### Routes
* `Get /` basic primitive website to search for images based on ID

* `GET /images?id=FILE_ID_HERE` fetches the file with the specified ID
  * Add an extension if you would like the image in a different format (current supported extensions include: `jpg, png, bmp, tiff`)
  * Example: `GET /images?id=8a85d386-67de-43c8-b15c-19bac10d66ac.jpg` Gives you the image back in jpg
  * Example: `GET /images?id=8a85d386-67de-43c8-b15c-19bac10d66ac` Gives you the image in the ext it was saved in

* `POST /images` inserts a new image into the file system and into the storage systems
  * Returns the ID of the file for use to retrieve

## Future Considerations
* MongoDB for storage
  * Store the Key:Value for ID:FileDetails
  * Filesystem could be offloaded to AWS instead or another file service
* Files by md5
  * For no duplicate images
  * tmp files for conversions, less space used
