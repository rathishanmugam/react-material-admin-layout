const mongoose = require('mongoose');
const Schema = mongoose.Schema

let itemDescriptionSchema = new Schema({
  serialNo: {type: String, required: true},
  modelNo: {type: String, required: true},
  HSNCodeNo: {type: String, required: true},
  companyName: {type: String, required: true},
  productType: {type: String, required: true},
  qty: {type: Number, default: 0},
  productRate: {type: Number, default: 0},
  gstRate: {type: Number, default: 0},
  sgstRate: {type: Number, default: 0},
  totalRate: {type: Number, default: 0},
})
let purchaseSchema = new Schema(
  {
    purchaseBillNo: {type: Number, required: true, index: true, unique: false},
    purchaseDate: {type: Date, default: Date.now()},
    // productCreditor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Creditor'
    // },
    productCreditor: {type: String, required: true},
    creditorGstIM: {type: String, required: true},
    creditorAddress: {type: String, required: true},
    creditorPhoneNo: {type: String, required: true},
    creditorMobileNo: {type: String, required: true},
    creditorEmail: {type: String, required: true},
    serialNo: {type: String, required: true},
    modelNo: {type: String, required: true},
    HSNCodeNo: {type: String, required: true},
    companyName: {type: String, required: true},
    productType: {type: String, required: true},
    qty: {type: Number, default: 0},
    productRate: {type: Number, default: 0},
    gstRate: {type: Number, default: 0},
    sgstRate: {type: Number, default: 0},
    totalRate: {type: Number, default: 0},
    instockDuration: {type: String}
  }, {
    collection: 'purchase'
  })

const Purchase = mongoose.model('Purchase', purchaseSchema)

module.exports = Purchase
