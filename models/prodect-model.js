const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: 'User',
     },
     name: {
          type: String,
          require: [true, 'Product needs a name'],
          trim: true,
     },
     sku: {
          type: String,
          require: true,
          trim: true,
          default: 'SKU',
          trim: true,
     },
     category: {
          type: String,
          require: [true, 'Product needs a category'],
          trim: true,
     },
     quantity: {
          type: String,
          require: [true, 'Product needs a quantity'],
          trim: true,
     },
     price: {
          type: String,
          require: [true, 'Product needs a price'],
          trim: true,
     },
     description: {
          type: String,
          require: [true, 'Product needs a description'],
          trim: true,
     },
     image: {
          type: String,
          default: {},
     },
},{
     timestamps: true
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product