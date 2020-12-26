const mongoose = require('mongoose')
const Schema = mongoose.Schema

let addressSchema = new Schema({
  // creditorId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Creditor'
  // },
  // customerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer'
  // },
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipCode: {type: Number, default: 0}

})

module.exports = mongoose.model('Address', addressSchema, 'address')


