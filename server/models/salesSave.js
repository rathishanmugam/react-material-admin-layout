let mongoose = require('mongoose');
let Sales = require('../models/sales.js');
let Suspense = require('../models/suspense.js');
let SalesSaveHelper = function (req, res) {
  let newSale = {};
  //  when paid by Finance ...
  if (req.body.billType === 'finance') {
    console.log('iam in finance');
    let financeSchema = Sales.schema.add(
      {financeName: {type: String, required: true}})
    let fianceSale = mongoose.model('Sales', financeSchema);
    newSale = new fianceSale(req.body);
  }

  //  when paid by credit...
  else if (req.body.billType === 'credit') {
    console.log('iam in credit');
    let creditSchema = Sales.schema.add(
      {
        initialAmountPaid: {type: Number, default: 0},
        loanAmount: {type: Number, default: 0},
        loanTenure: {type: String, required: true},
        duePerMonth: {type: Number, default: 0},
        monthsToPay: {type: Number, default: 0}
      })
    let creditSale = mongoose.model('Sales', creditSchema);

    newSale = new creditSale(req.body);
  }

  // when paid by cash...
  else if (req.body.billType === 'cash') {
    console.log('iam in cash');
    newSale = new Sales(req.body);
  }

  if (newSale != {}) {

    newSale.save().then(docsSale => {

      // if (newSale.delivered === false) {
      //   console.log('iam in delivery');
      //   let delivery = new Delivery();
      //   delivery.deliveryNo = newSale.billNo,
      //     delivery.salesDate = newSale.salesDate,
      //     delivery.customerName = newSale.customerName,
      //     delivery.address = newSale.address,
      //     delivery.phoneNo = newSale.phoneNo,
      //     delivery.modelNo = newSale.modelNo,
      //     delivery.qty = newSale.qty,
      //     delivery.companyName = newSale.companyName,
      //     delivery.productType = newSale.productType,
      //     delivery.totalRate = newSale.totalRate,
      //
      //     delivery.save().then(docsDelivery => {

      if (newSale.billType === 'credit') {
        console.log('iam in suspense');
        let suspense = new Suspense();
        suspense.customerName = newSale.customerName,
          suspense.address = newSale.address,
          suspense.phoneNo = newSale.phoneNo,
          suspense.email = newSale.email,
          suspense.loanAmount = newSale.loanAmount,
          suspense.duePerMonth = newSale.duePerMonth,
          suspense.monthsToPay = newSale.monthsToPay,
          suspense.dueDate = newSale.salesDate,
          suspense.graceDays = 0,
          suspense.paid = false,
          suspense.paidDue = 0,
          suspense.balanceDue = newSale.monthsToPay,

          suspense.save(function (err, docsSuspense) {

            if (err) return console.error(err);
            res.status(200).json({docsSale: docsSale, docsSuspense: docsSuspense});
          });
      }
      // });
      // }
    })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding User',
          error: err
        }))
  }
}
module.exports = SalesSaveHelper;
