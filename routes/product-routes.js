const express = require('express')
const router = express.Router()

const protect = require('../MiddleWare/auth-middleware')
const {upload} = require('../utils/fileUploader')

const { createProduct } = require('../controllers/product-controllor')

//Routes
router.post('/createproduct', protect, upload.single('image'), createProduct)

module.exports = router