const Sales = require('../../models/sales')
const SalesSaveHelper = require('../../models/salesSave');
const SalesUpdateHelper = require('../../models/salesUpdate');
const CreditDue = require('../../models/creditDue');
const Credit = require('../../models/credit');
const mongoose = require('mongoose');
const SalesProduct = require('../../models/salesProduct');
module.exports = function (router) {
  // router.get('/credit', function (req, res) {
  //   Credit.find().exec()
  //     .then(docs => res.status(200)
  //       .json(docs))
  //     .catch(err => res.status(500)
  //       .json({
  //         message: 'Error finding author',
  //         error: err
  //       }))
  // })

  router.get('/credit', function (req, res) {
    const pipeline = [
      {
        "$lookup": {
          "from": "creditDue",
          "localField": "creditDues",
          "foreignField": "_id",
          "as": "creditDues"
        }
      },
      {"$unwind": "$creditDue"}
    ]
    Credit.aggregate(pipeline).exec()
    // Credit.find().exec()
      .then(docs => {
        console.log('THE AGGREGATION CREDITOR RECORD IS ====>', docs);
        res.status(200).json(docs)
      })

      // .then(docs => res.status(200)
      //   .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })

  router.get('/credits', (req, res) => {
    // console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'creditDue.customerName') {
      sortParams = {'creditDue.customerName': ordering};
    } else if (queryParams.sort === 'creditNo') {
      sortParams = {creditNo: ordering};
    } else if (queryParams.sort === 'billNo') {
      sortParams = {billNo: ordering};
    } else if (queryParams.sort === 'totalNetAmount') {
      sortParams = {totalNetAmount: ordering};
    } else if (queryParams.sort === 'initialAmountPaid') {
      sortParams = {initialAmountPaid: ordering};
    } else if (queryParams.sort === 'loanAmount') {
      sortParams = {loanAmount: ordering};
    } else if (queryParams.sort === 'EMIPerMonth') {
      sortParams = {EMIPerMonth: ordering};
    } else if (queryParams.sort === 'loanInterest') {
      sortParams = {loanInterest: ordering};
    } else if (queryParams.sort === 'loanTenure') {
      sortParams = {loanTenure: ordering};
    }
    var query = {};
    Credit.find({
      '$or': [{"creditDue.customerName": {$regex: filter, $options: 'i'}}]

    })
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {'creditDue.customerName': 1})
      .exec()
      .then(docs => {
        Credit.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding purchase',
          error: err
        }))
  })

  // router.post('/credit', function (req, res) {
  //   console.log('iam in credit save ======>', req.body);
  //   // console.log('iam in credit save ======>', req.body.obj);
  //   // console.log('iam in credit save ======>', req.body.data);
  //   // console.log('iam in credit save ======>', req.body.data.credit);
  //   const array = [];
  //   const array1 = [];
  //
  //   const creditDue = new CreditDue();
  //   let newCredit = new Credit();
  //   let newSale = new Sales();
  //   let credit;
  //   for (let j = 0; j < req.body.data.products.length; j++) {
  //     // let o = {
  //     //   "serialNo": req.body.data.products[j].serialNo,
  //     //   "modelNo": req.body.data.products[j].modelNo,
  //     //   "companyName": req.body.data.products[j].companyName,
  //     //   "productType": req.body.data.products[j].productType,
  //     //   "qty": req.body.data.products[j].qty,
  //     //   "productRate": req.body.data.products[j].productRate,
  //     //   "gstRate": req.body.data.products[j].gstRate,
  //     //   "sgstRate": req.body.data.products[j].sgstRate,
  //     //   "totalRate": req.body.data.products[j].totalRate,
  //     // };
  //     // array.push(o);
  //     const saleProduct = new SalesProduct();
  //
  //     saleProduct.serialNo = req.body.data.products[j].serialNo,
  //       saleProduct.modelNo = req.body.data.products[j].modelNo,
  //       saleProduct.companyName = req.body.data.products[j].companyName,
  //       saleProduct.productType = req.body.data.products[j].productType,
  //       saleProduct.qty = req.body.data.products[j].qty,
  //       saleProduct.productRate = req.body.data.products[j].productRate,
  //       saleProduct.gstRate = req.body.data.products[j].gstRate,
  //       saleProduct.sgstRate = req.body.data.products[j].sgstRate,
  //       saleProduct.totalRate = req.body.data.products[j].totalRate
  //       saleProduct.save().then(product => {
  //         array.push(product._id);
  //         console.log('SALES PRODUCT ID ===>', array); })
  //         .catch(err => console.log('error',err));
  //   };
  //   // saleProduct.product = array,
  //
  //     // let credit;
  //     let totDue = 0;
  //     let tenure;
  //     for (let j = 0; j < req.body.obj.length; j++) {
  //       let o = {
  //         'billNo': req.body.obj[j].billNo,
  //         'customerName': req.body.obj[j].customerName,
  //         'creditNo': req.body.obj[j].creditNo,
  //         'dueAmount': req.body.obj[j].dueAmount,
  //         'dueStartDate': req.body.obj[j].dueStartDate,
  //         'dueEndDate': req.body.obj[j].dueEndDate,
  //         'dueCurrentDate': req.body.obj[j].dueCurrentDate,
  //         'payingDueAmount': req.body.obj[j].payingDueAmount,
  //         'payingDueDate': req.body.obj[j].payingDueDate,
  //         'duePaid': req.body.obj[j].duePaid,
  //         'gracePeriod': req.body.obj[j].gracePeriod,
  //       }
  //       array1.push(o);
  //     }
  //     // creditDue.creditDue = array1,
  //     //
  //     //   creditDue.save().then(due => {
  //     //   console.log('CREDIT DUE ID ===> ', due._id);
  //       newCredit.billNo = req.body.data.billNo,
  //
  //         newCredit.creditNo = req.body.data.credit.creditNo,
  //         newCredit.initialAmountPaid = req.body.data.credit.initialAmountPaid,
  //         newCredit.loanAmount = req.body.data.credit.loanAmount,
  //         // newCredit.loanTenure = tenure,
  //         newCredit.loanTenure = req.body.data.credit.loanTenure + req.body.data.credit.tenureType,
  //
  //         newCredit.loanInterest = req.body.data.credit.loanInterest,
  //         newCredit.EMIPerMonth = req.body.data.credit.EMIPerMonth,
  //         newCredit.totalInterestPayable = req.body.data.credit.totalInterestPayable,
  //         newCredit.totalAmountPayable = req.body.data.credit.totalAmountPayable,
  //         newCredit.duePayableDate = new Date(req.body.data.credit.duePayableDate).toISOString(),
  //         newCredit.totalPayableDues = req.body.data.credit.totalPayableDues,
  //         newCredit.duePending = 0,
  //         newCredit.creditDue =array1,
  //         newCredit.save().then(credit => {
  //           newSale.credit = mongoose.Types.ObjectId(credit._id),
  //             newSale.billNo = req.body.data.billNo,
  //             newSale.salesDate = req.body.data.salesDate,
  //             newSale.customerName = req.body.data.customerName,
  //             newSale.address = req.body.data.address,
  //             newSale.phoneNo = req.body.data.phoneNo,
  //             newSale.email = req.body.data.email,
  //             newSale.delivered = req.body.data.delivered,
  //             newSale.billType = req.body.data.billType,
  //             newSale.totalNetAmount = req.body.data.totalNetAmount,
  //             newSale.financeName = req.body.data.financeName,
  //             newSale.product = array;
  //               // newSale.product =  mongoose.Types.ObjectId(product._id),
  //             newSale.save(function (err, sale) {
  //               if (err) {
  //                 res.status(500).json(err);
  //                 return console.log(err);
  //               }
  //               res.status(200).json({sale: sale, credit: credit  })
  //             })
  //
  //         })
  //           .catch(err => res.status(500)
  //             .json({
  //               message: 'Error finding author',
  //               error: err
  //             }))
  //     });
  //   // });


  router.post('/credit', function (req, res) {
    console.log('iam in credit save ======>', req.body);
    console.log('iam in credit save ======>', req.body.obj);
    console.log('iam in credit save ======>', req.body.data);
    console.log('iam in credit save ======>', req.body.data.credit);

    const array = [];
    let newSale = new Sales();
    let newCredit = new Credit();
    let credit;
    let totDue = 0;
    let tenure;
    for (let j = 0; j < req.body.obj.length; j++) {
      let o = {
        'billNo': req.body.obj[j].billNo,
        'customerName': req.body.obj[j].customerName,
        'creditNo': req.body.obj[j].creditNo,
        'dueAmount': req.body.obj[j].dueAmount,
        'dueStartDate': req.body.obj[j].dueStartDate,
        'dueEndDate': req.body.obj[j].dueEndDate,
        'dueCurrentDate': req.body.obj[j].dueCurrentDate,
        'payingDueAmount': req.body.obj[j].payingDueAmount,
        'payingDueDate': req.body.obj[j].payingDueDate,
        'duePaid': req.body.obj[j].duePaid,
        'gracePeriod': req.body.obj[j].gracePeriod,
      }
      array.push(o);
    }
    // if (req.body.data.credit.loanTenure === 'months') {
    //   tenure = `${req.body.data.credit.loanTenureMonths} months`;
    //   console.log('iam in month====>', tenure);
    // } else if (req.body.data.credit.loanTenure === 'years') {
    //   tenure = `${req.body.data.credit.loanTenureYears} years`;
    //   console.log('iam in year====>', tenure);
    //
    // }
    // newCredit.billNo = req.body.data.credit.billNo,
    newCredit.billNo = req.body.data.billNo,

      newCredit.creditNo = req.body.data.credit.creditNo,
      newCredit.initialAmountPaid = req.body.data.credit.initialAmountPaid,
      newCredit.loanAmount = req.body.data.credit.loanAmount,
      // newCredit.loanTenure = tenure,
      newCredit.loanTenure =  req.body.data.credit.loanTenureMonths + req.body.data.credit.loanTenure ,

      newCredit.loanInterest = req.body.data.credit.loanInterest,
      newCredit.EMIPerMonth = req.body.data.credit.EMIPerMonth,
      newCredit.totalInterestPayable = req.body.data.credit.totalInterestPayable,
      newCredit.totalAmountPayable = req.body.data.credit.totalAmountPayable,
      newCredit.duePayableDate = new Date(req.body.data.credit.duePayableDate).toISOString(),
      newCredit.totalPayableDues = req.body.data.credit.totalPayableDues,
      newCredit.duePending = 0,
      newCredit.creditDue = array,
      newCredit.save().then(credit => {
        console.log('found id ', credit._id);
        newSale.credit = mongoose.Types.ObjectId(credit._id),
          newSale.billNo = req.body.data.billNo,
          newSale.salesDate = req.body.data.salesDate,
          newSale.customerName = req.body.data.customerName,
          newSale.address = req.body.data.address,
          newSale.phoneNo = req.body.data.phoneNo,
          newSale.email = req.body.data.email,
          newSale.delivered = req.body.data.delivered,
          console.log('body', req.body.data.products.length);
        let i = 1;
        for (let j = 0; j < req.body.data.products.length; j++) {
          let o = {
            // "sessionId": 'SID' + i++,
            "serialNo": req.body.data.products[j].serialNo,
            "modelNo": req.body.data.products[j].modelNo,
            "companyName": req.body.data.products[j].companyName,
            "productType": req.body.data.products[j].productType,
            "qty": req.body.data.products[j].qty,
            "productRate": req.body.data.products[j].productRate,
            "gstRate": req.body.data.products[j].gstRate,
            "sgstRate": req.body.data.products[j].sgstRate,
            "totalRate": req.body.data.products[j].totalRate,
          };
          newSale.products.push(o);
        }
        newSale.billType = req.body.data.billType,
          newSale.totalNetAmount = req.body.data.totalNetAmount,
          newSale.financeName = req.body.data.financeName,
          newSale.save(function (err, sale) {
            if (err) {
              res.status(500).json(err);
              return console.log(err);
            }
            res.status(200).json({sale: sale, credit: credit})
          });
      });
  });

  router.put('/credit/:creditNo/:parentId', function (req, res) {
    console.log('update due record =========>', req.body);
    let duePaid;
    let newDue;
    let dueAmount;
    let dueDate;
    let gracePeriod;
    let interest;
    let qry = {_id: req.params.parentId}

    Credit.findById(qry, (err, Credit) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      console.log('the docs are=====>', Credit.creditDue);
      for (let j = 0; j < Credit.creditDue.length; j++) {

        const currentDate = new Date(Credit.creditDue[j].dueCurrentDate).toDateString();
        const inputDate = new Date(req.body.dueCurrentDate).toDateString();
        console.log('input date is ======>', inputDate);
        console.log('current date is ======>', currentDate);
        let current = currentDate.split(' ');
        let start = inputDate.split(' ');
        let startMonth = start[1];
        let currentMonth = current[1];
        console.log('start and current month=====>', startMonth, currentMonth);
        if (startMonth === currentMonth) {
          console.log('iam equal');
          if (req.body.hasOwnProperty("sendInterest")) {
            if (req.body.sendInterest === true) {
              console.log('iam in interest true loop ======>', Credit.creditDue[j].dueCurrentDate);
              if (parseInt(req.body.payingDueAmount) !== 0) {
                newDue = parseInt(Credit.creditDue[j].dueAmount, 10) - parseInt(req.body.payingDueAmount, 10);
                console.log('new due calc with interest and with paritial payment =======>', newDue);
                Credit.creditDue[j].dueAmount = newDue;
                console.log('now due amt being as initial pay amt reduced =======>', Credit.creditDue[j].dueAmount);

              }
              if ((req.body.period !== '' && req.body.period !== 'undefined')) {

                let year = new Date(Credit.creditDue[j].dueCurrentDate).getFullYear();
                let month = new Date(Credit.creditDue[j].dueCurrentDate).getMonth();
                console.log('i got year month loop ======>', year, month);
                let days = new Date(year, month, 0).getDate();
                console.log('i got year month  days loop ======>', days);

                let due = Math.round((parseInt(Credit.creditDue[j].dueAmount, 10) / days) * parseInt(req.body.gracePeriod));
                newDue = parseInt(Credit.creditDue[j].dueAmount, 10) + due;
                Credit.creditDue[j].dueAmount = newDue,
                  console.log('new due calc with interest (dueAmt  grace  interest newdue) =========>', Credit.creditDue[j].dueAmount, req.body.gracePeriod, due, newDue);
              }
            } else if (req.body.sendInterest === false) {
              console.log('iam in interest false loop', Credit.creditDue[j].dueAmount, req.body.payingDueAmount);

              if (parseInt(req.body.payingDueAmount) !== 0) {
                newDue = parseInt(Credit.creditDue[j].dueAmount, 10) - parseInt(req.body.payingDueAmount, 10);
                console.log('new due calc without interest =======>', newDue);
              }
            }
          } else {
            if (parseInt(req.body.payingDueAmount) !== 0) {
              newDue = parseInt(Credit.creditDue[j].dueAmount, 10) - parseInt(req.body.payingDueAmount, 10);
              console.log('new due calc without interest =======>', newDue);
            }
          }
          if (parseInt(req.body.payingDueAmount) === parseInt(Credit.creditDue[j].dueAmount)) {
            duePaid = true;
            console.log('due paid fully', duePaid);
          } else if (parseInt(req.body.payingDueAmount) !== parseInt(Credit.creditDue[j].dueAmount)) {
            duePaid = false;
            console.log('only partial amt paid', duePaid);
          }
          obj = {
            'dueAmount': newDue || Credit.creditDue[j].dueAmount,
            'billNo': Credit.creditDue[j].billNo,
            'customerName': Credit.creditDue[j].customerName,
            'creditNo': Credit.creditDue[j].creditNo,
            'dueStartDate': Credit.creditDue[j].dueStartDate,
            'dueEndDate': Credit.creditDue[j].dueEndDate,
            'dueCurrentDate': Credit.creditDue[j].dueCurrentDate,
            'gracePeriod': req.body.gracePeriod || Credit.creditDue[j].gracePeriod,
            'payingDueAmount': req.body.payingDueAmount || Credit.creditDue[j].payingDueAmount,
            'payingDueDate': req.body.payingDueDate || Credit.creditDue[j].payingDueDate,
            'duePaid': duePaid,
          }
          Credit.creditDue.splice(j, 1, obj);
        }
      }

      // console.log('this is saving due record =======>', Credit.creditDue[j]);
      Credit.save({suppressWarning: true}, function (err, Credit) {
        if (err) {
          res.status(500).json(err);
          return console.log(err);
        }
        res.status(200).json(Credit)
      })
    });
  })
}


// Credit.creditDue[j].dueAmount = newDue || Credit.creditDue[j].dueAmount,
//   Credit.creditDue[j].billNo,
//   Credit.creditDue[j].customerName,
//   Credit.creditDue[j].creditNo,
//   Credit.creditDue[j].dueStartDate,
//   Credit.creditDue[j].dueEndDate,
//   Credit.creditDue[j].dueCurrentDate,
//   Credit.creditDue[j].gracePeriod = req.body.gracePeriod || Credit.creditDue[j].gracePeriod,
//   Credit.creditDue[j].payingDueAmount = req.body.payingDueAmount || Credit.creditDue[j].payingDueAmount,
//   Credit.creditDue[j].payingDueDate = req.body.payingDueDate || Credit.creditDue[j].payingDueDate,
//   Credit.creditDue[j].duePaid = duePaid,
// var insertOrder = function(nextId) {
//   console.log(nextId);
//   if ((orders.length - 1) < nextId) {
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback(function() {
//           throw err;
//         })
//       }
//       console.log(" ok");
//     });
//
//   } else {
//     console.log(orders[nextId]);
//     connection.query('INSERT INTO orders SET ?', orders[nextId], function(err, result2) {
//       if (err) {
//         return connection.rollback(function() {
//           throw err;
//         });
//       }
//
//       insertOrder(nextId + 1);
//     });
//   }
// }
// insertOrder(0);
//
// });
// });
