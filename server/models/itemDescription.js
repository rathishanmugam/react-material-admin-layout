const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemDescriptionSchema = new Schema({
    serialNo: {type: String, required: true},
    modelNo: {type: String, required: true},
    HSNCodeNo: {type: String, required: true},
    companyName: {type: String, required: true},
    productType: {type: String, required: true},
    qty: {type: Number, default: 0},
    rate: {type: Number, default: 0},
    gstRate: {type: Number, default: 0},
    sgstRate: {type: Number, default: 0},
    totalRate: {type: Number, default: 0},
  },
  {
    collection: 'itemDescription'
  })

const ItemDescription = mongoose.model('ItemDescription', itemDescriptionSchema)

module.exports = ItemDescription
