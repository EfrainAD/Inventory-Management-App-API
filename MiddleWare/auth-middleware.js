const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')

const protect = asyncHandler(async (req, res, next) => {
     try {
          const token = req.cookies.token
          if (!token) {
               res.status(401)
               throw new Error('not authorized')
          }

          // verify token
          const verified = jwt.verify(token, process.env.JWT_SECRET)

          // Get User
          const user = await User.findOne({_id: verified.id}).select('-password')
          if (!user) {
               res.status(401)
               throw new Error('not authorized')
          }

          req.user = user
          next()
     } catch (error) {
          res.status(401)
          // console.log('error:', error)
          throw new Error('not authorized')
     }
})

module.exports = protect