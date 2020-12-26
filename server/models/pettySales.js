const mongoose = require('mongoose')
const Schema = mongoose.Schema
const petty = ['chimney', 'gasStove', 'stablizer', 'iornBox', 'fan', 'mixie', 'grinder'];
const pettyValidator = [
  function (val) {
    let testVal = val.trim()
    return (petty.includes(testVal))
  },
  // Custom error text...
  '{PATH} must be petty product'
]

let productsSchema = new Schema({
  serialNo: {type: String, required: true},
  modelNo: {type: String, required: true},
  companyName: {type: String, required: true},
  productType: {
    type: String,
    enum: ['chimney', 'gasStove', 'stablizer', 'iornBox', 'fan', 'mixie', 'grinder'],
    required: true
  },
  qty: {type: Number, default: 0},
  productRate: {type: Number, default: 0},
  gstRate: {type: Number, default: 0},
  sgstRate: {type: Number, default: 0},
  totalRate: {type: Number, default: 0},
});
let pettySchema = new Schema({
    billNo: {type: Number, default: 0, index: true, unique: true},
    salesDate: {type: String},

    // salesDate: {type: Date, default: Date.now},
    products: [productsSchema],
    totalNetAmount: {type: Number, default: 0},
  },
  {
    collection: 'petty'
  })

const Petty = mongoose.model('Petty', pettySchema)

module.exports = Petty
