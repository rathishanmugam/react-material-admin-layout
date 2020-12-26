const Sales = require('../../models/sales')
const SalesSaveHelper = require('../../models/salesSave');
const SalesUpdateHelper = require('../../models/salesUpdate');
const SalesN = require('../../models/salesNormalize');
const Credit = require('../../models/credit')
const mongoose = require('mongoose')
const SalesProduct = require('../../models/salesProduct')

module.exports = function (router) {

  router.get('/sale', function (req, res) {
    Sales.find({}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding Sale',
          error: err
        }))
  })


  router.get('/sale/:billNo', function (req, res) {
    let qry = {billNo: req.params.billNo}

    Sales.find(qry).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding Sale',
          error: err
        }))
  })
  // router.get('/sale', function (req, res) {
  //    Sales.find()
  //      // .populate({ path: 'product credit', populate: { path: 'product' } })
  //      // .populate('credit product',{ sort: ['creditNo', 'desc'] })
  //      .populate('credit product')
  //      .exec()
  //     .then(docs => {
  //         let array = [];
  //       // docs.forEach( doc => {array = array.concat(doc)
  //       for(let i = 0; i< docs.length;i++) {
  //           for (let j = 0; j< docs[i].product.length;j++) {
  //             docs[i].product[j].instockDuration = "true";
  //        console.log('the DOCS PRODUCT ID are=====>', docs[i].product[j].serialNo);
  //       //     // (function( ans ) {
  //       //     //   console.log('IAM BEFORE FIND QUERY IS =====>' ,ans);
  //       //     //
  //       //     //   SalesProduct.find({_id: ans}).then(result => {
  //       //     //    console.log('IAM INSIDE FIND QUERY IS =====>',ans);
  //       //     //
  //       //     docs[i].product.push(docs[i].product[j]);
  //       //     //   // console.log('THE SALES PRODUCT RETURNED IS ===>', array ,array.length);
  //       //     // })
  //       //     // // .catch(err => console.log('error',err));
  //       //     // })(docs[i].product[j]);
  //          }
  //       //    array.push(docs[i]);
  //       //      console.log('THE END RESULT IS ====>' , array);
  //       //   // array=[];
  //        }
  //
  //       res.status(200).json(docs)
  //     })
  //     .catch(err => res.status(500)
  //       .json({
  //         message: 'Error finding sales',
  //         error: err
  //       }))
  // })

  router.get('/sales', (req, res) => {
    // console.log('iam taking all sales type =====> ', req.query);

    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'customerName') {
      sortParams = {customerName: ordering};
    } else if (queryParams.sort === 'productType') {
      sortParams = {productType: ordering};
    } else if (queryParams.sort === 'billType') {
    sortParams = {billType: ordering};
    } else if (queryParams.sort === 'totalNetAmount') {
      sortParams = {totalNetAmount: ordering};
    } else if (queryParams.sort === 'address') {
      sortParams = {address: ordering};
    } else if (queryParams.sort === 'billNo') {
      sortParams = {billNo: ordering};
    }
    // let sorting = queryParams.sort;
    var query = {};
    // Product.find()
    Sales.find({
      '$or': [{"address": {$regex: filter, $options: 'i'}}, {"customerName": {$regex: filter, $options: 'i'}},
        {"productType": {$regex: filter, $options: 'i'}}]
    })
      // .populate( {path: 'product', populate: { path: 'product',select:'productType rate' }})

      .populate('credit product') //, select: 'creditNo initialAmountPaid loanAmount EMIPerMonth loanTenure loanInterest'})
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {customerName: 1})
      .exec()
      .then(docs => {
        // console.log('POPULATED CREDITOR',docs);

        for (let j = 0; j < docs.length; j++) {
          const start = docs[j].billType;
          if (start === 'finance') {
            docs[j].billType = `${docs[j].financeName} Finance`;
          }
        }
        Sales.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding sales',
          error: err
        }))

  });

  router.get('/sales/credit', (req, res) => {
    console.log('request to backend =====> ', req.query);

    // console.log('iam taking credit sales only =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    var sortCreditParams;
    if (queryParams.sort === 'customerName') {
      sortParams = {'customerName': ordering};
      } else if (queryParams.sort === 'totalNetAmount') {
      sortParams = {totalNetAmount: ordering};
    } else if (queryParams.sort === 'billNo') {
      sortParams = {billNo: ordering};
    }else if (queryParams.sort === 'creditNo') {
      sortParams = {'credit.creditNo': ordering};
      console.log('main yahah noon', sortParams);

    } else if (queryParams.sort === 'initialAmountPaid') {
      sortParams = {'credit.initialAmountPaid': ordering};
    } else if (queryParams.sort === 'loanAmount') {
      sortParams = {'credit.loanAmount': ordering};
    } else if (queryParams.sort === 'EMIPerMonth') {
      sortParams = {'credit.EMIPerMonth': ordering};
    } else if (queryParams.sort === 'loanInterest') {
      sortParams = {'credit.loanInterest': ordering};
    } else if (queryParams.sort === 'loanTenure') {
      sortParams = {'credit.loanTenure': ordering};
    } else if (queryParams.sort === 'salesDate') {
      sortParams = {salesDate: ordering};
    }
    var query = {};
    // Product.find()
    Sales.find({
      "billType": 'credit',
      '$or': [ {"customerName": {$regex: filter, $options: 'i'}},
        {"productType": {$regex: filter, $options: 'i'}}]
    })
      .populate({
      path: 'credit',
      model: 'Credit',
      options: {sort:  sortParams || {"credit.creditNo": -1}}
    })
    //   .populate({path: 'credit', options: { sort: ['credit', 'desc'] }})
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
       .sort(sortParams || {"credit.creditNo": 1})
      .exec()
      .then(docs => {
        // duePending = 0;
           console.log('HERE THE RECORDS ======>',docs);
        // for (let j = 0; j < docs.length; j++) {
        //   // let qry = {creditNo: docs[j].credit.creditNo}
        //   // CreditDue.find(qry).exec()
        //   //   .then(docDue => {
        //   //     for (let j = 0; j < docs[j].length; j++) {
        //   console.log('today date', new Date());
        //   console.log('due payable date', new Date(docs[j].credit.duePayableDate).toISOString());
        //   const currentDate = new Date(docs[j].credit.duePayableDate).getTime();
        //   const todayDate = new Date().getTime();
        //   console.log('iam in time difference', currentDate, todayDate);
        //
        //   if (todayDate >= currentDate) {
        //     console.log('iam in pending');
        //     for (let i = 0; j < docs.credit.creditDue.length; i++) {
        //
        //       if (docs.credit.creditDue[i].duePaid === false) {
        //         duePending += 1;
        //       }
        //       console.log('i am in', duePending);
        //     }
        //     docs[j].credit.duePending = duePending;
        //
        //   }
        // }
        Sales.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        })
          .catch(err => res.status(500)
            .json({
              message: 'Error finding sales',
              error: err
            }))
      });
  });

  router.get('/sales/:id', function (req, res) {
    Sales.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding sales',
          error: err
        }))
  })
// create
//   router.post('/sales', function (req, res) {
//     console.log('iam in salessavehelper ======>', req.body);
//     const array = [];
//     let newSale = new Sales();
//     let credit;
//     if (req.body.data.billType === 'credit') {
//       for (let j = 0; j < req.body.obj.length; j++) {
//         let o = {
//           'billNo': req.body.obj[j].billNo,
//           'customerName': req.body.obj[j].customerName,
//           'creditNo': req.body.obj[j].creditNo,
//           'dueAmount': req.body.obj[j].dueAmount,
//           'dueStartDate': req.body.obj[j].dueStartDate,
//           'dueEndDate': req.body.obj[j].dueEndDate,
//           'dueCurrentDate': req.body.obj[j].dueCurrentDate,
//           'payingDueAmount': req.body.obj[j].payingDueAmount,
//           'payingDueDate': req.body.obj[j].payingDueDate,
//           'duePaid': req.body.obj[j].duePaid,
//           'gracePeriod': req.body.obj[j].gracePeriod,
//         };
//         array.push(o);
//       }
//       let totDue = 0;
//       let tenure;
//       if (req.body.data.credit.loanTenure === 'months') {
//         tenure = `${req.body.data.credit.loanTenureMonths} months`;
//         console.log('iam in month====>', tenure);
//       } else if (req.body.data.credit.loanTenure === 'years') {
//         tenure = `${req.body.data.credit.loanTenureYears} years`;
//         console.log('iam in year====>', tenure);
//
//       }
//       credit = {
//         'billNo': req.body.data.credit.billNo,
//         'creditNo': req.body.data.credit.creditNo,
//         'initialAmountPaid': req.body.data.credit.initialAmountPaid,
//         'loanAmount': req.body.data.credit.loanAmount,
//         'loanTenure': tenure,
//         'loanInterest': req.body.data.credit.loanInterest,
//         'EMIPerMonth': req.body.data.credit.EMIPerMonth,
//         'totalInterestPayable': req.body.data.credit.totalInterestPayable,
//         'totalAmountPayable': req.body.data.credit.totalAmountPayable,
//         'duePayableDate': req.body.data.credit.duePayableDate,
//         'totalPayableDues': req.body.data.credit.totalPayableDues,
//         // 'dueEndYear': req.body.data.credit.dueEndYear,
//         // 'currentDue': req.body.data.credit.currentDue,
//         // 'duePending': 0,
//         creditDue: array,
//       }
//
//     }
//     newSale.credit = credit || null,
//       newSale.billNo = req.body.data.billNo,
//       newSale.salesDate = req.body.data.salesDate,
//       newSale.customerName = req.body.data.customerName,
//       newSale.address = req.body.data.address,
//       newSale.phoneNo = req.body.data.phoneNo,
//       newSale.email = req.body.data.email,
//       newSale.delivered = req.body.data.delivered,
//
//       console.log('body', req.body.data.products.length);
//     let i = 1;
//     for (let j = 0; j < req.body.data.products.length; j++) {
//       let o = {
//         // "sessionId": 'SID' + i++,
//         "serialNo": req.body.data.products[j].serialNo,
//         "modelNo": req.body.data.products[j].modelNo,
//         "companyName": req.body.data.products[j].companyName,
//         "productType": req.body.data.products[j].productType,
//         "qty": req.body.data.products[j].qty,
//         "productRate": req.body.data.products[j].productRate,
//         "gstRate": req.body.data.products[j].gstRate,
//         "sgstRate": req.body.data.products[j].sgstRate,
//         "totalRate": req.body.data.products[j].totalRate,
//       };
//       newSale.products.push(o);
//     }
//     newSale.billType = req.body.data.billType,
//       newSale.totalNetAmount = req.body.data.totalNetAmount,
//       newSale.financeName = req.body.data.financeName,
//       newSale.save(function (err, Sale) {
//         if (err) return console.log(err)
//         res.status(200).json(Sale)
//       })
//   });


  // // update by id
  router.put('/sales/:creditNo', function (req, res) {
    // SalesUpdateHelper(req, res);
    console.log('==================>', req.body);
    console.log('==================>', req.body.duePaid);

    Sales.find({'credit.creditNo': req.params.creditNo}, (err, Sales) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      console.log('=============================>', Sales);
      for (let j = 0; j < Sales.length; j++) {
        if (req.body.duePaid === true) {
          Sales[j].credit.duePending = parseInt(Sales[j].credit.duePending, 10) - 1,
            console.log('================>', Sales[j].credit.duePending);
        }
        Sales[j].save(function (err, Sales) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(Sales)
        })
      }
    });
  });

  // delete user from database
  router.delete('/sales/:_id', function (req, res) {
    console.log('iam in delete record **************>', req.body)
    let qry = {_id: req.params._id}
    Sales.remove(qry, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(respRaw)
    })
  })

  // router.put('/sales/:billNo/:creditNo', function (req, res) {
  //   console.log('update record ', req.params, req.body);
  //   let qry = {'billNo': req.body.billNo}
  //   Sales.find({'credit.billNo': req.body.billNo}, {'credit.creditNo': req.body.creditNo}).exec()
  //     .then(creditSales => {
  //       const sale = Object.assign({}, creditSales);
  //       console.log('iam in update ************>', sale);
  //       let id = sale[0].credit._id;
  //       let qry = {'credit._id': mongoose.Types.ObjectId(id)}
  //       Sales.findOne(qry, (err, newSale) => {
  //         console.log('iam in update ************>', newSale);
  //
  //         //   if (err) {
  //         //     console.log(`*** CustomersRepository.editCustomer error: ${err}`);
  //         //     return callback(err);
  //         //   }
  //         // });
  //         //   // Sale.updateOne(function (err, respRaw) {
  //       })
  //     })
  //     .catch(err => res.status(500)
  //       .json({
  //         message: 'Error finding sales',
  //         error: err
  //       }))
  //   // })
  // });




  router.post('/sales', function (req, res) {
    console.log('iam in salessavehelper ======>', req.body);
    const array = [];
    let newSale = new Sales();
    let credit;
    if (req.body.billType !== 'credit') {
      // CreditDue.find().exec()
      //   .then(docs => {
      //     console.log('the docs are =====>', docs);
      //     for (let j = 0; j < docs.length; j++) {
      //       let o = {
      //         'creditorDue': docs[j]._id
      //       }
      //       array.push(o);
      //     }
      //     console.log('the created array is=====>', array);
      //     let totDue = 0;
      //     let tenure;
      //     if (req.body.credit.loanTenure === 'months') {
      //       tenure = `${req.body.credit.loanTenureMonths} months`;
      //       console.log('iam in month====>', tenure);
      //     } else if (req.body.credit.loanTenure === 'years') {
      //       tenure = `${req.body.credit.loanTenureYears} years`;
      //       console.log('iam in year====>', tenure);
      //
      //     }
      //     credit = {
      //       'billNo': req.body.credit.billNo,
      //       'creditNo': req.body.credit.creditNo,
      //       'initialAmountPaid': req.body.credit.initialAmountPaid,
      //       'loanAmount': req.body.credit.loanAmount,
      //       'loanTenure': tenure,
      //       'loanInterest': req.body.credit.loanInterest,
      //       'EMIPerMonth': req.body.credit.EMIPerMonth,
      //       'totalInterestPayable': req.body.credit.totalInterestPayable,
      //       'totalAmountPayable': req.body.credit.totalAmountPayable,
      //       'duePayableDate': req.body.credit.duePayableDate,
      //       'totalPayableDues': req.body.credit.totalPayableDues,
      //       // 'dueEndYear': req.body.data.credit.dueEndYear,
      //       // 'currentDue': req.body.data.credit.currentDue,
      //       // 'duePending': 0,
      //       creditDue: array,
      //     }


      newSale.credit = null,
        newSale.billNo = req.body.billNo,
        newSale.salesDate = req.body.salesDate,
        newSale.customerName = req.body.customerName,
        newSale.address = req.body.address,
        newSale.phoneNo = req.body.phoneNo,
        newSale.email = req.body.email,
        newSale.delivered = req.body.delivered,

        console.log('body', req.body.products.length);
      let i = 1;
      for (let j = 0; j < req.body.products.length; j++) {
        let o = {
          // "sessionId": 'SID' + i++,
          "serialNo": req.body.products[j].serialNo,
          "modelNo": req.body.products[j].modelNo,
          "companyName": req.body.products[j].companyName,
          "productType": req.body.products[j].productType,
          "qty": req.body.products[j].qty,
          "productRate": req.body.products[j].productRate,
          "gstRate": req.body.products[j].gstRate,
          "sgstRate": req.body.products[j].sgstRate,
          "totalRate": req.body.products[j].totalRate,
        };
        newSale.products.push(o);
      }
      newSale.billType = req.body.billType,
        newSale.totalNetAmount = req.body.totalNetAmount,
        newSale.financeName = req.body.financeName,
        newSale.save(function (err, Sale) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(Sale)
        })
    }
  })

  router.get('/sal/chart', function (req, res) {
    console.log('iam in chart');
    var start = new Date("2020-01-01"); // otherwise new Date(req.params.start)
    var end = new Date(Date.now());   // otherwise new Date(req.params.end)
    console.log('the pipeline ======>', start , end);

    // const endDt = new Date(Date.UTC(year, month, 1))
    const pipeline = [

      // { "$project": {
      //     "salesDate": 1,'products.companyName': 1}},
       {
        $match: {
          salesDate: {  "$gte": start, "$lte": end  }
        }
      },
      { "$unwind": "$products" },
      {
        $group: {
             _id: "$products.serialNo",
          // _id:"$salesDate",
          "salesDate": { "$first": "$salesDate" },
          "product": { "$first": "$products.companyName" },
          "productType": { "$first": "$products.productType" },

          // salesDate:"$salesDate",
          // product: '$products.companyName' ,

          qty: { $sum: '$products.qty' },
          rate: { $sum: '$products.totalRate' }
        }
      },

    ]
console.log('the pipeline ======>', pipeline);
    Sales.aggregate(pipeline).exec()
    // Sales.aggregate.group({ _id: "$_id",
    //   salesDate:"$salesDate",
    //   // qty: { $sum: '$qty' },
    //   // totalRate: { $sum: '$totalRate' }
    // }).exec()

      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding transactions for user',
          error: err
        }))
  })

  router.get('/sale/chart/bar', function (req, res) {
    console.log('iam in bar chart');

    var start = new Date("2020-01-01"); // otherwise new Date(req.params.start)
    var end = new Date(Date.now());   // otherwise new Date(req.params.end)
    const pipeline = [
      {
        $match: {
          salesDate: {  "$gte": start, "$lte": end  }
        }
      },
      { "$unwind": "$products" },
      {
        $group: {
          // _id: "$products.serialNo",
          //  _id:"$salesDate",
          // _id: {$substr: ['$salesDate', 5, 2]},
          "_id": {
            "month": {$substr: ['$salesDate', 5, 2]},
            "serialNo": "$products.serialNo",
            // "product": "$products.companyName",
            // "type":  "$products.productType",
          },
          "salesDate": { "$first": "$salesDate" },
          "product": { "$first": "$products.companyName" },
          "productType": { "$first": "$products.productType" },
          qty: { $sum: '$products.qty' },
          rate: { $sum: '$products.totalRate' }
        }
      },

    ]
    Sales.aggregate(pipeline).collation({ locale: 'en_US', strength: 1 }).exec()
      .then(docs => {
        // for (let j = 0; j < docs.length; j++) {
        // const month = docs[j]._id.month;
        //   const name = new Date(docs[j].product);
        //   for (let i = 0; i < 12; i++) {
        //     this.month[i] = (start === i) ? qty[k] : 0;
        //     // (start === i) ? this.month.push(qty[k]) : 0;
        //   }
        //   this.res1.push(this.month)
        //
        //   console.log('THE MONTH =====>', this.month);
        //   console.log('THE MONTH after push =====>', this.res1);
        //
        //   // const result = ids.map((id, i) => ({ x: id, y: times[i] }));
        //   this.res.unshift({data: this.month , label: name[k] });
        //   console.log('THE final loop =====>', this.res[k]);
        //
        //   // this.res.push(val);
        //   k++;
        // }
        res.status(200).json(docs)
      })

      .catch(err => res.status(500)
        .json({
          message: 'Error finding transactions for user',
          error: err
        }))
  })
}


// select:'creditNo initialAmountPaid EMIPerMonth loanInterest loanTenure'

