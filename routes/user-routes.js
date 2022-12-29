const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser, signInUser, signOutUser } = require('../controllers/user-controllor')

router.post('/register', registerUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)

module.exports = router