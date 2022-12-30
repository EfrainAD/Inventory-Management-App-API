const Product = require('../models/prodect-model')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id
     const {name, sku, category, quantity, price, description} = req.body
     // make suk

     // validation
     if (!name || !category || !quantity || !price || !description) {
          res.status(400)
          throw new Error('Missing a required field')
     }
     // image stuff for later
     
     //create prodect
     const product = await Product.create({
          user: userId,
          name: name,
          sku: sku,
          category: category,
          quantity: quantity,
          price: price,
          description: description,
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