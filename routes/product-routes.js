const express = require('express')
const router = express.Router()
const protect = require('../MiddleWare/auth-middleware')
const {upload} = require('../utils/fileUploader')
const { createProduct } = require('../controllers/product-controllor')

//Routes
router.post('/', protect, upload.single('image'), createProduct)

module.exports = router