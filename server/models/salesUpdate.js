let mongoose = require('mongoose');
let Sales = require('../models/sales.js');
let salesUpdateHelper = function (req, res) {

  let updateSale = {};

  let callback = function (err) {
    if (err) return console.error(err);
    res.sendStatus(200).json(updateSale);
    if (updateSale.delivered === true) {
      let doc = Delivery.filter(d => d.serialNo === updateSale.deliveryNo);
      let qry = {_id: doc._id}
      Delivery.remove(qry, function (err, respRaw) {
        if (err) return console.log(err)
        res.status(200).json(respRaw)
      })
    }
  };

  // when paid by fiance
  if (req.body.billType === 'finance') {
    let financeSchema = Sales.schema.add(
      {financeName: {type: String, required: true}})
    let fianceSale = mongoose.model('Sales', financeSchema);

    // if (!req.body.hasOwnProperty('financeName')) {
    //   updateSale.financeName = req.body.financeName;
    //   updateSale = new fianceSale(req.body);
    //   Sales.findOneAndUpdate({_id: req.params.id}, updateSale, callback);
    // }
    if (req.body.hasOwnProperty('financeName')) {
      updateSale = req.body;
      // updateSale.financeName = req.body.financeName;

      fianceSale.findOneAndUpdate({_id: req.params.id}, updateSale, callback);
    }
  }

// when paid by credit
  if (req.body.billType === 'credit') {
    let creditSchema = Sales.schema.add(
      {
        initialAmountPaid: {type: Number, default: 0},
        loanAmount: {type: Number, default: 0},
        loanTenure: {type: String},
        duePerMonth: {type: Number, default: 0},
        monthsToPay: {type: Number, default: 0}
      })
    let creditSale = mongoose.model('Sales', creditSchema);


    // if (!req.body.hasOwnProperty('loanAmount')) {
    //   updateSale = new creditSale(req.body);
    //   updateSale.initialAmountPaid = req.body.initialAmountPaid;
    //   updateSale.loanAmount = req.body.loanAmount;
    //   updateSale.loanTenure = req.body.loanTenure;
    //   updateSale.duePerMonth = req.body.duePerMonth;
    //   updateSale.monthsToPay = req.body.monthsToPay;
    //   Sales.findOneAndUpdate({_id: req.params.id}, updateSale, callback);
    // }
    if (req.body.hasOwnProperty('loanAmount')) {
      updateSale = req.body;
      // updateSale.financeName = req.body.financeName;

      creditSale.findOneAndUpdate({_id: req.params.id}, updateSale, callback);
    }
  }


  // when paid by cash ...
  if (req.body.billType === 'Cash') {
    // Our document already has "requiresInsurance" field... just update!
    // if (req.body.hasOwnProperty('requiresInsurance')) {
    //   let insuredItemSchema = Item.schema.add(
    //     { requiresInsurance: { type: Boolean, default: false } })
    //   let InsuredItem = mongoose.model('Item', insuredItemSchema);
    //
    //   updateSale = req.body;
    //
    //   InsuredItem.findOneAndUpdate({_id: req.params.id}, updateItem, callback);
    // }

    // Update the Item document as you normally would...
    // if (!req.body.hasOwnProperty('requiresInsurance')) {
    updateSale = req.body;
    Sales.findOneAndUpdate({_id: req.params.id}, updateSale, callback);

  }

}

module.exports = salesUpdateHelper;
