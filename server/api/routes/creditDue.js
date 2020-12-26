const CreditDue = require('../../models/creditDue')
const Sales = require('../../models/sales')

module.exports = function (router) {
  router.get('/creditDue', function (req, res) {
    CreditDue.find().exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })


  router.get('/creditDue/:billNo', function (req, res) {
    console.log('body od  credit due =====>', req.params.billNo);
    CreditDue.find({billNo: req.params.billNo}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding CreditDue',
          error: err
        }))
  })

  // router.post('/creditDue', function (req, res) {
  //   let user = new CreditDue(req.body)
  //   console.log(req.body)
  //   user.save(function (err, user) {
  //     if (err) return console.log(err)
  //     res.status(200).json(user)
  //   })
  // })


  router.post('/creditDue', function (req, res) {
    let user = new CreditDue(req.body)
    console.log('the new body is=====>', req.body)
    user.save(function (err, user) {
      //  const array = [];
      // let tenure;
      // let newSale = new Sales();
      // if (req.body.data.credit.loanTenure === 'months') {
      //   tenure = `${req.body.data.credit.loanTenureMonths} months`;
      //   console.log('iam in month====>', tenure);
      // } else if (req.body.data.credit.loanTenure === 'years') {
      //   tenure = `${req.body.data.credit.loanTenureYears} years`;
      //   console.log('iam in year====>', tenure);
      //
      // }
      // for (let j = 0; j < user.length; j++) {
      //   let o = {
      //     'creditDue': user[j]._id
      //   }
      //   array.push(o);
      // }
      //
      // let credit = {
      //   'creditDue': array,
      //   'creditNo': req.body.data.credit.creditNo,
      //   'initialAmountPaid': req.body.data.credit.initialAmountPaid,
      //   'loanAmount': req.body.data.credit.loanAmount,
      //   'loanTenure': tenure,
      //   'loanInterest': req.body.data.credit.loanInterest,
      //   'EMIPerMonth': req.body.data.credit.EMIPerMonth,
      //   'totalInterestPayable': req.body.data.credit.totalInterestPayable,
      //   'totalAmountPayable': req.body.data.credit.totalAmountPayable,
      //   'duePayableDate': req.body.data.credit.duePayableDate,
      //   'totalPayableDues': req.body.data.credit.totalPayableDues,
      //   // 'dueEndYear': req.body.data.credit.dueEndYear,
      //   // 'currentDue': req.body.data.credit.currentDue,
      //   // 'duePending': 0,
      // }
      // newSale.billNo = req.body.data.billNo,
      //   newSale.salesDate = req.body.data.salesDate,
      //   newSale.customerName = req.body.data.customerName,
      //   newSale.address = req.body.data.address,
      //   newSale.phoneNo = req.body.data.phoneNo,
      //   newSale.email = req.body.data.email,
      //   newSale.delivered = req.body.data.delivered,
      //
      //   console.log('body', req.body.data.products.length);
      // let i = 1;
      // for (let j = 0; j < req.body.data.products.length; j++) {
      //   let o = {
      //     // "sessionId": 'SID' + i++,
      //     "serialNo": req.body.data.products[j].serialNo,
      //     "modelNo": req.body.data.products[j].modelNo,
      //     "companyName": req.body.data.products[j].companyName,
      //     "productType": req.body.data.products[j].productType,
      //     "qty": req.body.data.products[j].qty,
      //     "productRate": req.body.data.products[j].productRate,
      //     "gstRate": req.body.data.products[j].gstRate,
      //     "sgstRate": req.body.data.products[j].sgstRate,
      //     "totalRate": req.body.data.products[j].totalRate,
      //   };
      //   newSale.products.push(o);
      // }
      // newSale.billType = req.body.data.billType,
      //   newSale.totalNetAmount = req.body.data.totalNetAmount,
      //   newSale.financeName = req.body.data.financeName,
      //   newSale.credit = credit,
      //   newSale.save(function (err, Sale) {


      if (err) return console.log(err)
      res.status(200).json(user)
    })

  })
  // })
  router.put('/creditDue/:creditNo/:dueCurrentDate', function (req, res) {
    console.log('update due record =========>', req.body)
    let duePaid;
    let newDue;
    let interest;
    let qry = {creditNo: req.params.creditNo}

    CreditDue.find(qry).exec()
      .then(docDue => {
        for (let j = 0; j < docDue.length; j++) {
          const currentDate = new Date(docDue[j].dueCurrentDate).toDateString();
          const inputDate = new Date(req.params.dueCurrentDate).toDateString();
          console.log('input date is ======>', inputDate);
          console.log('current date is ======>', currentDate);
          let current = currentDate.split(' ');
          let start = inputDate.split(' ');
          let startMonth = start[1];
          let currentMonth = current[1];
          console.log('start and current month=====>', startMonth, currentMonth);
          if (startMonth === currentMonth) {
            console.log('iam equal');

            if (req.body.sendInterest === true) {
              console.log('iam in interest true loop ======>', docDue[j].dueCurrentDate);

              if ((req.body.period !== '' && req.body.period !== 'undefined')) {

                let year = new Date(docDue[j].dueCurrentDate).getFullYear();
                let month = new Date(docDue[j].dueCurrentDate).getMonth();
                console.log('i got year month loop ======>', year, month);
                let days = new Date(year, month, 0).getDate();
                console.log('i got year month  days loop ======>', days);

                let due = Math.round((parseInt(docDue[j].dueAmount, 10) / days) * parseInt(req.body.gracePeriod));
                newDue = parseInt(docDue[j].dueAmount, 10) + due;
                docDue[j].dueAmount = due,
                  console.log('new due calc with interest (day  grace  newdue) =========>', days, req.body.gracePeriod, newDue);
              }
            } else if (req.body.sendInterest === false) {
              console.log('iam in interest false loop', docDue[j].dueAmount, req.body.payingDueAmount);

              if (parseInt(req.body.payingDueAmount) !== 0) {
                newDue = parseInt(docDue[j].dueAmount, 10) - parseInt(req.body.payingDueAmount, 10);
                console.log('new due calc without interest =======>', newDue);
              }
            }
            if (parseInt(req.body.payingDueAmount) !== 0) {
              newDue = parseInt(docDue[j].dueAmount, 10) - parseInt(req.body.payingDueAmount, 10);
              console.log('new due calc without interest =======>', newDue);
            }
            if (parseInt(req.body.payingDueAmount) === parseInt(docDue[j].dueAmount)) {
              duePaid = true;
              console.log('due paid fully', duePaid);
            } else if (parseInt(req.body.payingDueAmount) !== parseInt(docDue[j].dueAmount)) {
              duePaid = false;
              console.log('only partial amt paid', duePaid);
            }
            docDue[j].dueAmount = newDue || docDue[j].dueAmount,
              docDue[j].billNo ,
              docDue[j].customerName ,
              docDue[j].creditNo ,
              docDue[j].dueStartDate,
              docDue[j].dueEndDate ,
              docDue[j].dueCurrentDate ,
              docDue[j].gracePeriod = req.body.gracePeriod || docDue[j].gracePeriod,
              docDue[j].payingDueAmount = req.body.payingDueAmount || docDue[j].payingDueAmount,
              docDue[j].payingDueDate = req.body.payingDueDate || docDue[j].payingDueDate,
              docDue[j].duePaid = duePaid,
              console.log('this is saving due record =======>', docDue[j]);
            docDue[j].save(function (err, credit) {
              if (err) return console.log(err)
              res.status(200).json(credit)
            })
          }
        }
      });
  }),

    // delete user from database
    router.delete('/creditDue/:_id', function (req, res) {
      console.log('iam in delete record', req.body)
      let qry = {_id: req.params._id}
      Author.remove(qry, function (err, respRaw) {
        if (err) return console.log(err)
        res.status(200).json(respRaw)
      })
    })

  router.put('/creditDues', function (req, res) {

    console.log('iam in salessavehelper ======>');
    const array = [];
    let newSale = new Sales();
    let credit;
    if (req.body.billType === 'credit') {
      CreditDue.find({creditNo: req.body.credit.creditNo}).exec()
        .then(docs => {
          console.log('the docs are =====>', docs);
          for (let j = 0; j < docs.length; j++) {
            if (docs[j].creditNo === req.body.credit.creditNo) {
              array.push(docs[j]._id);
            }
          }
          console.log('the created array is=====>', array);
          let totDue = 0;
          let tenure;
          if (req.body.credit.loanTenure === 'months') {
            tenure = `${req.body.credit.loanTenureMonths} months`;
            console.log('iam in month====>', tenure);
          } else if (req.body.credit.loanTenure === 'years') {
            tenure = `${req.body.credit.loanTenureYears} years`;
            console.log('iam in year====>', tenure);

          }
          credit = {
            'billNo': req.body.credit.billNo,
            'creditNo': req.body.credit.creditNo,
            'initialAmountPaid': req.body.credit.initialAmountPaid,
            'loanAmount': req.body.credit.loanAmount,
            'loanTenure': tenure,
            'loanInterest': req.body.credit.loanInterest,
            'EMIPerMonth': req.body.credit.EMIPerMonth,
            'totalInterestPayable': req.body.credit.totalInterestPayable,
            'totalAmountPayable': req.body.credit.totalAmountPayable,
            'duePayableDate': req.body.credit.duePayableDate,
            'totalPayableDues': req.body.credit.totalPayableDues,
            // 'dueEndYear': req.body.data.credit.dueEndYear,
            // 'currentDue': req.body.data.credit.currentDue,
            // 'duePending': 0,
            creditDue: array,
          }


          newSale.credit = credit || null,
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
              if (err) return console.log(err)
              res.status(200).json({Sale, docs})
            })
        })
    }
  })
}


// function daysInMonth (month, year) {
//   return new Date(year, month, 0).getDate();
// }
//
// // July
// daysInMonth(7,2009); // 31
// // February
// daysInMonth(2,2009); // 28
// daysInMonth(2,2008); // 29
//
//

