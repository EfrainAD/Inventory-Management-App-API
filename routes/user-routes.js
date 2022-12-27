const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser, signInUser } = require('../controllers/user-controllor')

router.post('/register', registerUser)
router.post('/signin', signInUser)

module.exports = router