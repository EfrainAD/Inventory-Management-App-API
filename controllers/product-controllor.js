const Product = require('../models/prodect-model')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(async (req, res) => {
     res.send('hi')
})

module.exports = {
     createProduct,
}