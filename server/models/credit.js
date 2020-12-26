const mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
// Schema = mongoose.Schema;
// objectId = Schema.ObjectId;
let creditDueSchema = new Schema({
  _id: {type: ObjectId},
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
const creditSchema = new Schema({
  billNo: {type: Number, default: 0},
  creditNo: {type: Number, default: 0},
  initialAmountPaid: {type: Number, default: 0},
  loanAmount: {type: Number, default: 0},
  loanTenure: {type: String},
  loanInterest: {type: Number, default: 0},
  EMIPerMonth: {type: Number, default: 0},
  totalInterestPayable: {type: Number, default: 0},
  totalAmountPayable: {type: Number, default: 0},
  duePayableDate: {type: Date, default: Date.now()},
  totalPayableDues: {type: Number, default: 0},
  // dueEndYear: {type: Date, default:Date.now()},
  // currentDue: {type: Date, default:Date.now()},
  duePending: {type: Number, default: 0},
    creditDue: [creditDueSchema],
   // creditDue: [ { type: Schema.ObjectId, ref: 'CreditDue' }]
}, {
  collection: 'credits'
})
module.exports = mongoose.model('Credit', creditSchema);
