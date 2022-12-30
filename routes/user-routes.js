const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser, signInUser, signOutUser, getUser, signInStatus, updateUser, changePassword, forgotPassword, resetPassword } = require('../controllers/user-controllor')
const protect = require('../MiddleWare/auth-middleware')
const { Router } = require('express')

// Create and Sign in and out users
router.post('/register', registerUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)
// User Profile
router.get('/getuser', protect, getUser)
router.patch('/updateuser', protect, updateUser)
// is user signed in - user status
router.get('/signedin', signInStatus)
// Making New Password
router.patch('/changepassword', protect, changePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)

module.exports = router