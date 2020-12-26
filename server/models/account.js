const mongoose = require('mongoose')
const Schema = mongoose.Schema
let accountSchema;
const requiredStringValidator = [
  function (val) {
    let testVal = val.trim()
    return (testVal.length > 0)
  },
  // Custom error text
  'Please supply a value for {PATH}'
]
accountSchema = new Schema({
  accountNo: {type: Number, default: 0, unique: true},
  // accountDate:{type: Date, default: Date.now()},
  particulars: {type: String, required: true, validate: requiredStringValidator},
  credit: {type: Number, default: 0},
  debit: {type: Number, default: 0},
  balance: {type: Number, default: 0},
  // netCredit:{type: Number, default: 0},
  // netDebit:{type: Number, default: 0},
  // netBalance:{type: Number, default: 0},
  createdOn: {type: String},

});
module.exports = mongoose.model('Account', accountSchema, 'account')

