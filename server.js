const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
//Roouters
const userRoutes = require('./routes/user-routes')
const productRoutes = require('./routes/product-routes')
const contactRoutes = require('./routes/contact-routes')

const errorHandler = require('./MiddleWare/error-middleware')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 8000
const frontPageUrl = process.env.FRONT_PAGE_URL

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
     origin: [ frontPageUrl ],
     credentials: true
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes Middleware
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/contactus', contactRoutes)

// Routes
app.get('/', (req, res) => {
     res.send('<div style="height:100%;display:flex;justify-content:center;align-items:center;"><h1>This API is working!</h1></div>')
})

// Middleware Error
app.use(errorHandler)

mongoose.connect(process.env.MONGO)
     .then(() => {
          app.listen(PORT, () => { console.log(`This server is running on port ${PORT}`) })
     })
     .catch((error) => console.log(error))
