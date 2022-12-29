const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser, signInUser, signOutUser, getUser, signInStatus } = require('../controllers/user-controllor')
const protect = require('../MiddleWare/auth-middleware')

router.post('/register', registerUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)
router.get('/getuser', protect, getUser)
router.get('/signedin', signInStatus)

module.exports = router