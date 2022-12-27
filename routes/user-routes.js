const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser } = require('../controllers/user-controllor')

router.post('/register', registerUser)

module.exports = router