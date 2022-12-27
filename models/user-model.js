const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Must have a name']
     },
     email: {
          type: String,
          required: [true, 'Must have an email'],
          unique: true,
          trim: true,
          match: [
               /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
               "Email not valid"
          ],
          password: {
               type: String,
               required: [true, 'Must have a password'],
               minLength: [8, 'Password must be at least 8 characters long'],
               maxLength: [23, 'Password must be shorter then 23 characters long']
          },
          photo: {
               type: String,
               required: [true, 'Must have a photo'],
               default: 'https://i.ibb.co/4pDNDk1/avatar.png'
          },
          phone: {
               type: String,
               default: '+1'
          },
          bio: {
               type: String,
               maxLength: [250, 'Bio must be shorter then 250 characters long'],
               default: 'bio'
          }
     }
},{
     timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User