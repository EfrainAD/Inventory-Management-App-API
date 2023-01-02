const express = require('express')
const router = express.Router()
const protect = require('../MiddleWare/auth-middleware')
const {upload} = require('../utils/fileUploader')
const { createProduct, getProducts } = require('../controllers/product-controllor')

//Routes
router.post('/', protect, upload.single('image'), createProduct)
router.get('/', protect, getProducts)

module.exports = router