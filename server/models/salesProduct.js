const mongoose = require('mongoose')
const Schema = mongoose.Schema
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
let salesProductSchema = new Schema({
   // _id: {type: mongoose.Types.ObjectId},
  serialNo: {type: String, required: true},
  modelNo: {type: String, required: true},
  companyName: {type: String, required: true},
  productType: {type: String, required: true},
  qty: {type: Number, default: 0},
  productRate: {type: Number, default: 0},
  gstRate: {type: Number, default: 0},
  sgstRate: {type: Number, default: 0},
  totalRate: {type: Number, default: 0},
  instockDuration: {type: String}
// }, {
//   toJSON: {
//     virtuals: true,
//   },
});

// const SalesProduct = mongoose.model('SalesProduct', salesProductSchema)
module.exports = mongoose.model('SalesProduct', salesProductSchema, 'salesProduct')

// module.exports = SalesProduct
