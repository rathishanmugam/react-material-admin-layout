const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const mongoosePaginate = require('mongoose-paginate')
// var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const requiredStringValidator = [
  function (val) {
    let testVal = val.trim()
    return (testVal.length > 0)
  },
  // Custom error text
  'Please supply a value for {PATH}'
]
var validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
var validatePhone = function (phone) {
  let re = /\d{3}-\d{3}-\d{4}/;
  return re.test(phone)
};

let customerSchema = new Schema({
    name: {type: String, required: true, validate: requiredStringValidator},
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    email: {
      type: String, lowercase: true,
      unique: true, required: true, validate: [validateEmail, 'Please fill a valid email address']
    },
    phone1: {type: String, required: true, validate: [validatePhone, 'Please fill a valid phone no ']},
    phone2: {type: String, validate: [validatePhone, 'Please fill a valid phone no ']},
    mobile1: {type: String, required: true, validate: [validatePhone, 'Please fill a valid mobile no ']},
    mobile2: {type: String, validate: [validatePhone, 'Please fill a valid mobile no ']},
    createdOn: {type: Date, default: Date.now}

  },
  {
    collection: 'customer'
  })

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
