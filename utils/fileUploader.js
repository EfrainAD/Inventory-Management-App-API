const multer = require('multer')
const STORAGE_MODE = process.env.STORAGE_MODE || "memory" // 'disk'

let storage
if (STORAGE_MODE === 'memory')
     storage = multer.memoryStorage()
else if (STORAGE_MODE === 'disk')
     storage = multer.diskStorage({
          destination: function (req, file, cb) {
               cb(null, 'uploads')
          },
          filename: function (req, file, cd) {
               cd(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
          }
     })

// Set what file formats can be saved.
const fileFilter = (req, file, cb) => {
     if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg' 
     ) {
          cb(null, true)
     } else {
          cb(null, false)
     }
}

// File Size Formatter
const fileSizeFormatter = (bytes, decimal) => {
     if (bytes === 0) {
       return "0 Bytes";
     }
     const dm = decimal || 2;
     const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
     const index = Math.floor(Math.log(bytes) / Math.log(1000));
     return (
       parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
     );
   };

const upload = multer({storage, fileFilter})
module.exports = {upload, fileSizeFormatter}