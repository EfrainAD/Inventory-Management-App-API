const Product = require('../models/prodect-model')
const asyncHandler = require('express-async-handler')
const { fileSizeFormatter } = require('../utils/fileUploader')
const uploadToCloudinary = require('../utils/uploadToCloudinary')
fileSizeFormatter
const cloudinary = require('cloudinary').v2
// All images from this app to to this cloudinary folder
const cloudinaryFolder = process.env.CLOUDINARY_FOLDER

// POST
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
     if (req.file) 
          fileData = await uploadToCloudinary(req.file, sku)
     
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
// GET
const getProducts = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const products = await Product.find({user: userId}).sort('-createdAt')
     res.status(200).json(products)
})
// GET
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
// DELETE
const deleteProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const productId = req.params.id

     const product = await Product.findOneAndDelete({user: userId, _id: productId}) 

     if (product === null) {
          res.status(404)
          throw new Error('Product not found, product does not exist or user does not have access.')
     }
     
     // If the product has an image, delete it from cloudinary.
     if (JSON.stringify(product.image) !== '{}') {
          const publicID = `${cloudinaryFolder}/${product.sku}`
          
          const response = await cloudinary.uploader.destroy(publicID)
          
          if (response.result !==  'ok') 
               console.log('Errer: Cloudinary API returned', response)
     }
     
     res.status(200).json(product)
})
// PATCH
const updateProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const productId = req.params.id
     
     let fileData = {}
     if (req.file) {
          const { sku } = await Product.findOne({user: userId, _id: productId})
          
          // Save Image to Cloudinary
          const fileData = await uploadToCloudinary(req.file, sku)

          req.body = {...req.body, image: fileData}
     }

     const product = await Product.findOneAndUpdate(
          {_id: productId, user: userId}, 
          req.body, 
          {new: true, runValidators: true}
     )
     
     if (!product) {
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
     updateProduct,
}