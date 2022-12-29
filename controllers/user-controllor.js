const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const createToken = (id) => {
     return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

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

module.exports = {
     registerUser,
     signInUser,
     signOutUser,
     getUser,
     signInStatus,
}