const mongoose = require('mongoose')
const Schema = mongoose.Schema
credit = require('./credit');

let salesSchema = new Schema({
    billNo: {type: Number, default: 0},
    salesDate: {type: Date, default: Date.now},
    customerName: {type: String, required: true},
    address: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String, required: true},
    serialNo: {type: String, required: true},
    modelNo: {type: String, required: true},
    companyName: {type: String, required: true},
    productType: {type: String, required: true},
    qty: {type: Number, default: 0},
    productRate: {type: Number, default: 0},
    gstRate: {type: Number, default: 0},
    sgstRate: {type: Number, default: 0},
    totalRate: {type: Number, default: 0},
    billType: {type: String, required: true},
    credit: credit.schema,
    financeName: {type: String},
    delivered: {type: Boolean, required: true, default: false},

  },
  {
    collection: 'salesNormalize'
  })
const SalesN = mongoose.model('SalesN', salesSchema)

module.exports = SalesN
