const mongoose = require('mongoose')
const Schema = mongoose.Schema

let suspenseSchema = new Schema({
    customerName: {type: String, required: true},
    address: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String, required: true},
    loanAmount: {type: Number, default: 0},
    duePerMonth: {type: Number, default: 0},
    monthsToPay: {type: Number, default: 0},
    dueDate: {type: Date, default: Date.now},
    graceDays: {type: Number, default: 0},
    paid: {type: Boolean, required: true},
    paidDue: {type: Number, default: 0},
    balanceDue: {type: Number, default: 0}
  },
  {
    collection: 'suspense'
  })

const Suspense = mongoose.model('Suspense', suspenseSchema)

module.exports = Suspense
