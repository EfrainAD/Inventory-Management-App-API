const Product = require('../models/prodect-model')
const asyncHandler = require('express-async-handler')
const { fileSizeFormatter } = require('../utils/fileUploader')
fileSizeFormatter

const createProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const {name, sku, category, quantity, price, description} = req.body
     // make suk

     // validation
     if (!name || !category || !quantity || !price || !description) {
          res.status(400)
          throw new Error('Missing one or more required fields')
     }

     // upload image 
     let fileData = {}
     if (req.file) {
          fileData = {
               fileName: req.file.originalname,
               filePath: req.file.path,
               fileType: req.file.mimetype,
               fileSize: fileSizeFormatter(req.file.size, 2),
          }
     }
     
     //create prodect
     const product = await Product.create({
          user: userId,
          name: name,
          sku: sku,
          category: category,
          quantity: quantity,
          price: price,
          description: description,
          image: fileData,
     })
     if (!product) {
          res.status(500)
          throw new Error('Failed to create product.')
     }

     res.status(201).json(product)
})

module.exports = {
     createProduct,
}