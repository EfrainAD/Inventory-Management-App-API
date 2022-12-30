const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')
const Token = require('../models/token-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { findOne } = require('../models/user-model')
const sendEmail = require('../utils/sendEmail')

const createToken = (id) => {
     return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}
const createHashedToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

// Register User
const registerUser = asyncHandler(async (req, res) => {
     const { name, email, password } = req.body
     const emailValidater = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
     
     // Validation
     if (!name, !email, !password) {
          res.status(400)
          throw new Error('Pllease fill in a required missing fields')
     }
     if (!emailValidater.test(email.trim())) {
          res.status(400)
          throw new Error("Email not valid")
     }
     if (password.length < 8) {
          res.status(400)
          throw new Error('Password must be at least 8 characters long')
     }
     if (password.length >= 23) {
          res.status(400)
          throw new Error('Password must be shorter then 23 characters long')
     }
     // check is user already exist.
     const existsUser = await User.findOne({email: email})
     if (existsUser) {
          res.status(400)
          throw new Error('User already exists with this email')
     }
     // create user
     const user = await User.create({
          name, 
          email, 
          password})
          if (user) {
               const {_id, name, email, photo, phone, bio} = user

               // Create cookie
               const token = createToken(_id)
               res.cookie('token', token, {
                    path: '/',
                    httpOnly: true,
                    expires: new Date(Date.now() + 1000 * 86400), // 1 Day
                    sameSite: 'none',
                    secure: true
               })

               res.status(201).json({
                    _id, token, name, email, photo, phone, bio
               })
          } else {
               res.status(400)
               throw new Error('Invalid user data')
          }
     }
)
// Sign In
const signInUser = asyncHandler(async (req, res) => {
     const {email, password} = req.body
     
     if (!email || !password) {
          res.status(400)
          throw new Error('You need both email and passowrd')
     }

     const user = await User.findOne({email})
     if (!user) {
          res.status(400)
          throw new Error('user or password is invalid')
     }
     const isPasswordCorrect = await bcrypt.compare(password, user.password)
     if (user && isPasswordCorrect) {
          const {_id, name, email, photo, phone, bio} = user

          // Create cookie
          const token = createToken(_id)
          res.cookie('token', token, {
               path: '/',
               httpOnly: true,
               expires: new Date(Date.now() + 1000 * 86400), // 1 Day
               sameSite: 'none',
               secure: true
          })

          res.status(200).json({
               _id, token, name, email, photo, phone, bio
          })
     } else {
          res.status(400)
          throw new Error('user or password is invalid')
     }
})
// Sign Out
const signOutUser = asyncHandler(async (req, res) => {
     res.cookie('token', '', {
          path: '/',
          httpOnly: true,
          expires: new Date(0), 
          sameSite: 'none',
          secure: true
     })
     res.status(200).json({msg: 'Signed Out Successful'})
})
// Get User info
const getUser = asyncHandler(async (req, res) => {
     // const user = await User.findOne({_id: req.user.id})
     const user = req.user
     if (user) {
          const {_id, name, email, photo, phone, bio} = user

          res.status(201).json({
               _id, name, email, photo, phone, bio
          })
     } else {
          res.status(400)
          throw new Error('User Not Found')
     }
})

const signInStatus = asyncHandler(async (req, res) => {
     const token = req.cookies.token
     if (!token) return res.json(false)
     
     const varifiy = jwt.verify(token, process.env.JWT_SECRET)
     if (varifiy) {
        return res.json(true)
     }
     return res.json(false)
})

// Update User 
const updateUser = asyncHandler(async (req, res) => {
     const id =  req.user._id
     const userEmail = req.user.email
     
     if (req.body.email) {
          req.body.email = userEmail
     }

     const updatedUser = await User.findOneAndUpdate(
          {_id: id}, 
          req.body, 
          {new: true, runValidators: true}
     )
     
     if (updatedUser){
          const {_id, name, email, photo, phone, bio} = updatedUser

          res.status(200).json({_id, name, email, photo, phone, bio})
     } else {
          res.status(404)
          throw new Error('User not found')
     }
})

const changePassword = asyncHandler(async (req, res) => {
     const id =  req.user._id
     const {old_password, new_password, comferm_password} = req.body
     const user = await User.findOne({_id: id})

     // Validation new password
     if (!old_password || !new_password || !comferm_password) {
          res.status(400)
          throw new Error('You are missing fields')
     }
     if (new_password !== comferm_password) {
          res.status(400)
          throw new Error('Passwords and comform password do not match')
     }
     if (new_password.length < 8) {
          res.status(400)
          throw new Error('Password must be at least 8 characters long')
     }
     if (new_password.length >= 23) {
          res.status(400)
          throw new Error('Password must be shorter then 23 characters long')
     }

     // Validate if old password is correct
     const isValidated = await bcrypt.compare(old_password, user.password)
     if (!isValidated) {
          res.status(404) 
          throw new Error('wrong password')
     }

     // Update User Password with the new one.
     user.password = new_password
     await user.save()
     
     res.status(200).json({msg: 'Password Changed'})
})

const forgotPassword = asyncHandler(async (req, res) => {
     const {email} = req.body
     const user = await User.findOne({email: email})
     const minutesEmailExpires = 30
     
     // Validates
     if (!email) {
          res.status(400)
          throw new Error('Need User Email')
     }
     if (!user) {
          res.status(400)
          throw new Error('No user by that email')
     }

     // User can only have one Token, delete if they have one
     await Token.findOneAndDelete({userId: user._id})

     // Create & Encrypt Token
     let resetToken = crypto.randomBytes(32).toString('hex') + user._id
     const hashedToken = createHashedToken(resetToken)
     // save token
     await new Token({
          userId: user._id,
          token: hashedToken,
          createdAt: Date.now(),
          expiresAt: Date.now() + minutesEmailExpires * (60 * 1000), // 30 min
     }).save()

     // Create the componenents for the reset email
     const resetUrl = `${process.env.FRONT_PAGE_URL}/resetpassword/${resetToken}`
     const message = `
          <h2>hello ${user.name}</h2>
          <p>You requested a password reset</p>
          <p>Please use the url below to reset your password</p>
          <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

          <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

          <p>Regards...</p>
          <p>Stock Management Team</p>
     `
     const subject = 'Reset Password Request'
     const send_to = user.email
     const sent_from = process.env.EMAIL_USER

     // Send the reset Email
     try {
          await sendEmail(subject, message, send_to, sent_from)
          res.status(200).json({sussess: true, msg: "Reset Email Sent"})
     } catch (error) {
          res.status(500)
          throw new Error('Failed to send a password reset email')
     }
})
const resetPassword = asyncHandler(async (req, res) => {
     const {new_password, comfirm_password} = req.body
     const {resetToken} = req.params
     const hashedToken = createHashedToken(resetToken)

     // Validation
     if (!new_password, !comfirm_password) {
          res.status(400)
          throw new Error('All fields are requried')
     }
     if (new_password !== comfirm_password) {
          res.status(400)
          throw new Error('passwords don\'t match')
     }
     if (!resetToken) {
          res.status(404)
          throw new Error('Bad link')
     }

     // Get a validated user's token from DB   
     const userToken = await Token.findOne({
          token: hashedToken,
          expiresAt: {$gt: Date.now()}
     })
     if (!userToken) {
          res.status(404)
          throw new Error('Token not found, maybe expired')
     }

     // Get User from Token's owner
     const user = await User.findOne({_id: userToken.userId})
     if (!user) {
          res.status(404)
          throw new Error('Error')
     }

     // Save new password
     user.password = new_password
     await user.save()

     // Remove token so it can't be used again.
     await Token.findOneAndDelete({userId: user._id})
     
     res.status(200).json({
          msg: 'Password reset Sucessful'
     })
})
module.exports = {
     registerUser,
     signInUser,
     signOutUser,
     getUser,
     signInStatus,
     updateUser,
     changePassword,
     forgotPassword,
     resetPassword,
}