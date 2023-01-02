const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const userRoutes = require('./routes/user-routes')
const productRoutes = require('./routes/product-routes')
const errorHandler = require('./MiddleWare/error-middleware')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 8000

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes Middleware
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)

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
