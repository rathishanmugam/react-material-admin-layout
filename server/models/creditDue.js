const mongoose = require('mongoose')
const Schema = mongoose.Schema
let creditDuesSchema = new Schema({
  billNo: {type: Number, default: 0},
  customerName: {type: String, required: true},
  creditNo: {type: Number, default: 0},
  dueAmount: {type: Number, default: 0},
  dueStartDate: {type: Date, default: Date.now()},
  dueEndDate: {type: Date, default: Date.now()},
  dueCurrentDate: {type: Date, default: Date.now()},
  gracePeriod: {type: Number, default: 0},
  duePaid: {type: Boolean, required: true, default: false},
  payingDueDate: {type: Date, default: null},
  payingDueAmount: {type: Number, default: 0},
})
let creditDueSchema = new Schema({
  // _id: {type: mongoose.Types.ObjectId},
  // creditDue: [creditDuesSchema],
  billNo: {type: Number, default: 0},
  customerName: {type: String, required: true},
  creditNo: {type: Number, default: 0},
  dueAmount: {type: Number, default: 0},
  dueStartDate: {type: Date, default: Date.now()},
  dueEndDate: {type: Date, default: Date.now()},
  dueCurrentDate: {type: Date, default: Date.now()},
  gracePeriod: {type: Number, default: 0},
  duePaid: {type: Boolean, required: true, default: false},
  payingDueDate: {type: Date, default: null},
  payingDueAmount: {type: Number, default: 0}
})
module.exports = mongoose.model('CreditDue', creditDueSchema, 'creditDue')

