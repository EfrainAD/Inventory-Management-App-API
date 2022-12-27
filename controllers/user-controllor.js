const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')

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
     const user = await User.create({name, email, password})
     if (user) {
          const {_id, name, email, photo, phone, bio} = user
          res.status(201).json({
               _id, name, email, photo, phone, bio
          })
     } else {
          res.status(400)
          throw new Error('Invalid user data')
     }
})

module.exports = {
     registerUser,
}