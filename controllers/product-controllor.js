const Product = require('../models/prodect-model')
const asyncHandler = require('express-async-handler')
const { fileSizeFormatter } = require('../utils/fileUploader')
fileSizeFormatter
const cloudinary = require('cloudinary').v2

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
          // Save Image to Cloudinary
          let uploadedFile
          try {
               uploadedFile =  await cloudinary.uploader.upload(req.file.path, {
                    folder: 'Inventory Management App',
                    resource_type: 'image'
               })
          } catch (error) {
               res.status(500)
               throw new Error('Image failed to uploal.')
          }

          fileData = {
               fileName: req.file.originalname,
               filePath: uploadedFile.secure_url,
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
const getProducts = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const products = await Product.find({user: userId}).sort('-createdAt')
     res.status(200).json(products)
})
const getAProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const productId = req.params.id
     const product = await Product.find({user: userId, _id: productId})
     if (product.length === 0) {
          res.status(404)
          throw new Error('Product not found, product does not exist or user does not have access.')
     }
     res.status(200).json(product)
})
const deleteProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const productId = req.params.id
     const product = await Product.deleteOne({user: userId, _id: productId})
     if (product.deletedCount === 0) {
          res.status(404)
          throw new Error('Product not found, product does not exist or user does not have access.')
     }
     res.status(200).json(product)
})

module.exports = {
     createProduct,
     getProducts,
     getAProduct,
     deleteProduct,
}