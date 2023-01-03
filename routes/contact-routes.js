const express = require('express')
const { contactUs } = require('../controllers/contact-controllor')
const router = express.Router()
const protect = require('../MiddleWare/auth-middleware')

router.post('/', protect, contactUs)

module.exports = router