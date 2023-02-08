const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2
const { fileSizeFormatter } = require('./fileUploader');

// Upload Image to Cloudinary from BUFFER
const uploadToCloudinary = async (file, publicId) => {
     const parser = new DatauriParser();
     
     let cloudinaryFile 
     
     // convert the buffer file
     const imageFile = parser.format(file.mimetype, file.buffer)
     
     try {
          cloudinaryFile =  await cloudinary.uploader.upload(imageFile.content, {
               public_id: publicId,
               folder: 'Inventory Management App',
               resource_type: 'image'
          })
     } catch (error) {
          res.status(500)
          throw new Error('Image failed to uploal.')
     }
     // return fileData
     return {
          fileName: file.originalname,
          filePath: cloudinaryFile.secure_url,
          fileType: file.mimetype,
          fileSize: fileSizeFormatter(file.size, 2),
     }
}

module.exports = uploadToCloudinary