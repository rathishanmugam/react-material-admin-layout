const mongoose = require('mongoose')
const Schema = mongoose.Schema

let productSchema = new Schema({
    serialNo: {type: String, unique: true, required: true},
    modelNo: {type: String, required: true},
    HSNCodeNo: {type: String, required: true},
    companyName: {type: String, required: true},
    productType: {type: String, required: true},
    qty: {
      type: Number, min: 1, validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }, required: true
    },
    rate: {type: Number, required: true},
    gstRate: {type: Number, required: true},
    sgstRate: {type: Number, required: true},
    updatedOn: {type: Date, default: Date.now},
  },
  {
    collection: 'product'
  })

const Product = mongoose.model('Product', productSchema)

module.exports = Product
