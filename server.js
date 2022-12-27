const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user-routes')
const errorHandler = require('./MiddleWare/error-middleware')

const dotenv = require('dotenv').config()
const PORT = process.env.PORT

const app = express()

// Middleware
app.use(express.json())
app.use(bodyParser.json())

// Routes Middleware
app.use('/api/users', userRoutes)

// Routes
app.get('/', (req, res) => {
     res.send('Home Page')
})

// Middleware Error
app.use(errorHandler)

mongoose.connect(process.env.MONGO)
     .then(() => {
          app.listen(PORT, () => { console.log(`This server is running on port ${PORT}`) })
     })
     .catch((error) => console.log(error))
