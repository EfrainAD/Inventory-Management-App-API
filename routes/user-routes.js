const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const { registerUser, signInUser, signOutUser, getUser, signInStatus, updateUser, changePassword, forgotPassword, resetPassword } = require('../controllers/user-controllor')
const protect = require('../MiddleWare/auth-middleware')
const { Router } = require('express')

router.post('/register', registerUser)
router.post('/signin', signInUser)
router.get('/signout', signOutUser)
router.get('/getuser', protect, getUser)
router.get('/signedin', signInStatus)
router.patch('/updateuser', protect, updateUser)
router.patch('/changepassword', protect, changePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)

module.exports = router