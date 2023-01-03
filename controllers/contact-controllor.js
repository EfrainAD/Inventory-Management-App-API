const asyncHandler = require('express-async-handler')
// modues
const sendEmail = require('../utils/sendEmail')

const contactUs = asyncHandler(async (req, res) => {
     const {subject, message} = req.body
     const {user} = req
     console.log('subject', subject)
     // Validation
     if (!subject || !message) {
          res.status(400)
          throw new Error('Missing fields')
     }
     const send_to = process.env.EMAIL_USER
     const sent_from = process.env.EMAIL_USER
     const reply_to = user.email
     // Send the reset Email
     try {
          await sendEmail(subject, message, send_to, sent_from, reply_to)
          res.status(200).json({sussess: true, msg: "Email Sent"})
     } catch (error) {
          res.status(500)
          throw new Error('Failed to send email')
     }
     // res.send(subject + ' : ' + reply_to )
})

module.exports = {contactUs}