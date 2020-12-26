const mongoose = require('mongoose')
const Schema = mongoose.Schema
credit = require('./credit');
SalesProduct = require('./salesProduct')
let productsSchema = new Schema({
  serialNo: {type: String, required: true},
  modelNo: {type: String, required: true},
  companyName: {type: String, required: true},
  productType: {type: String, required: true},
  qty: {type: Number, default: 0},
  productRate: {type: Number, default: 0},
  gstRate: {type: Number, default: 0},
  sgstRate: {type: Number, default: 0},
  totalRate: {type: Number, default: 0},
});
let salesSchema = new Schema({
    billNo: {type: Number, default: 0, index: true, unique: true},
    salesDate: {type: Date, default: Date.now},
    customerName: {type: String, required: true},
    address: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String, required: true},
  // product:[ { type: Schema.Types.ObjectId, ref: 'SalesProduct' } ],
     products: [productsSchema],
    totalNetAmount: {type: Number, default: 0},
    billType: {type: String, required: true},
    // credit: credit.schema,
    credit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Credit'
    },
    financeName: {type: String},
    delivered: {type: Boolean, required: true, default: false},

  // }, {
  // toJSON: {
  //   virtuals: true,
  // },
});
// const Sales = mongoose.model('Sales', salesSchema,   sales)
module.exports = mongoose.model('Sales', salesSchema, 'sales')

// module.exports = Sales
