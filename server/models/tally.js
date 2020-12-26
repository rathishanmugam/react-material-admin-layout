const mongoose = require('mongoose')
const Schema = mongoose.Schema
tallySchema = new Schema({
  netCredit:{type: Number, default: 0},
  netDebit:{type: Number, default: 0},
  netBalance:{type: Number, default: 0},
  createdOn: {type: Date, default:Date.now()},

});
module.exports = mongoose.model('Tally', tallySchema, 'tally')

