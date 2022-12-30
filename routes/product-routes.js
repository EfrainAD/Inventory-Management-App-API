const express = require('express')
const router = express.Router()

const protect = require('../MiddleWare/auth-middleware')

const { createProduct } = require('../controllers/product-controllor')

//Routes
router.post('/createproduct', protect, createProduct)

module.exports = router