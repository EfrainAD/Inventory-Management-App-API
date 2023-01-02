const express = require('express')
const router = express.Router()
const protect = require('../MiddleWare/auth-middleware')
const {upload} = require('../utils/fileUploader')
const { createProduct, getProducts, getAProduct, deleteProduct } = require('../controllers/product-controllor')

//Routes
router.post('/', protect, upload.single('image'), createProduct)
router.get('/', protect, getProducts)
router.get('/:id', protect, getAProduct)
router.delete('/:id', protect, deleteProduct)


module.exports = router