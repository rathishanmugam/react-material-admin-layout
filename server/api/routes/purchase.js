const Purchase = require('../../models/purchase')
const Product = require('../../models/product');
const mongoose = require('mongoose')
// Get all event from database
module.exports = function (router) {
  console.log('iam entering');
  router.get('/purchases', function (req, res) {
    console.log("iam in purchase");

    Purchase.find({}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding Purchase',
          error: err
        }))
  })
  router.get('/purchase', (req, res) => {
    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'productCreditor') {
      sortParams = {productCreditor: ordering};
    } else if (queryParams.sort === 'purchaseBillNo') {
      sortParams = {purchaseBillNo: ordering};
    } else if (queryParams.sort === 'serialNo') {
      sortParams = {serialNo: ordering};
    } else if (queryParams.sort === 'productRate') {
      sortParams = {productRate: ordering};
    } else if (queryParams.sort === 'totalRate') {
      sortParams = {totalRate: ordering};
    } else if (queryParams.sort === 'modelNo') {
      sortParams = {modelNo: ordering};
    }
    // let sorting = queryParams.sort;
    var query = {};
    // Product.find()
    Purchase.find({
      '$or': [{"productCreditor": {$regex: filter, $options: 'i'}},{"modelNo": {$regex: filter, $options: 'i'}},
        {"serialNo": {$regex: filter, $options: 'i'}}]
    })
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {productCreditor: 1})
      .exec()
      .then(docs => {
        for (let j = 0; j < docs.length; j++) {
          const start = new Date(docs[j].purchaseDate);
          const now = new Date();
          let date = 0;
          let days = 0;
          let months = 0;
          let years = 0;
          let monthRemind = 0;
          let yearRemind = 0;
          var diff = Math.floor(now.getTime() - start.getTime());
          var day = 1000 * 60 * 60 * 24;
           days = Math.floor(diff / day);
           // months = Math.floor(days / 31);
           // years = Math.floor(months / 12);
          if(days >= 31 ){
             months =  Math.floor(days / 31);
             date = Math.floor(days % 31);
            console.log('the remin days in month', months, date);
          }else if(days >365){
            years = Math.floor(days / 12);
            yearRemind = Math.floor(days % 12);

            if(yearRemind >= 31){
              months = Math.floor(yearRemind / 31);
              date = Math.floor(yearRemind % 31);
              console.log('the remin days in year',years , months, date);

            }else   if(yearRemind < 31){
              date = Math.floor(yearRemind % 31);
              console.log('the remin days in day' , date);

            }
          }if(days < 31){
            date = days;
          }
           let message = `Since ${years} year ,${months} month , ${date} days`;

          // let message = `Since ${days} days, Since ${months} month,${years} years ago`;
           console.log('the stock maintained in store ====>', message);
          docs[j].instockDuration = message;
        }
        Purchase.count({}, function (err, count) {
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

  // get specific event from database
  router.get('/purchase/:id', function (req, res) {
    console.log("iam in get session:" + req.params.id);
    const qry = req.params.id;

    console.log(req.params.id)
    Purchase.findById({'_id': qry}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding event',
          error: err
        }))
  })

  router.post('/purchase', function (req, res) {
    let purchase = new Purchase(req.body)
    console.log("adding body ==========>", req.body);
    purchase.save(function (err, purchase) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(purchase)
    })
  })

  // Create new book document...
  // router.post('/purchase', function (req, res) {
  //   // let Event = new event(req.body)
  //   let oldStock = [];
  //   let purchase = new Purchase();
  //   purchase.purchaseBillNo = req.body.purchaseBillNo,
  //     purchase.purchaseDate = req.body.purchaseDate,
  //     purchase.creditorsId = mongoose.Types.ObjectId(req.body.creditorsId),
  //     purchase.productCreditors = req.body.productCreditors,
  //     console.log('body', req.body.itemDescription.length);
  //   let i = 1;
  //   for (let j = 0; j < req.body.itemDescription.length; j++) {
  //     let o = {
  //       // "sessionId": 'SID' + i++,
  //       "serialNo": req.body.itemDescription[j].serialNo,
  //       "modelNo": req.body.itemDescription[j].modelNo,
  //       "HSNCodeNo": req.body.itemDescription[j].HSNCodeNo,
  //       "productId": req.body.itemDescription[j].productId,
  //       "companyName": req.body.itemDescription[j].companyName,
  //       "productType": req.body.itemDescription[j].productType,
  //       "qty": req.body.itemDescription[j].qty,
  //       "rate": req.body.itemDescription[j].rate,
  //       "gstRate": req.body.itemDescription[j].gstRate,
  //       "sgstRate": req.body.itemDescription[j].sgstRate,
  //       "totalRate": req.body.itemDescription[j].totalRate,
  //     };
  //     purchase.itemDescription.push(o);
  //     // let qry = {'serialNo': req.body.itemDescription[j].serialNo}
  //     // Stock.find(qry).then(docStock => {
  //     //   console.log('the docs exist ', docStock);
  //     //   if (docStock) {
  //     //     console.log('iam exist', req.body.itemDescription[j].serialNo, docStock);
  //     //     let quantity = parseInt(docStock.qty, 10) + parseInt(req.body.itemDescription[j].qty, 10);
  //     //     Stock.findOneAndUpdate({_id: docStock._id}, {qty: quantity},function (err,obj) {
  //     //       if (err) return console.log(err)
  //     //       res.status(200).json(obj)
  //     //     });
  //     //   }
  //     //   else if (!docStock) {
  //     //     console.log('iam not exist');
  //     //     let stock = new Stock()
  //     //     stock.serialNo = req.body.itemDescription[j].serialNo,
  //     //       stock.modelNo = req.body.itemDescription[j].modelNo,
  //     //       stock.companyName = req.body.itemDescription[j].companyName,
  //     //       stock.productType = req.body.itemDescription[j].productType,
  //     //       stock.qty = req.body.itemDescription[j].qty,
  //     //       stock.updatedOn = Date.now,
  //     //       stock.save(function (err,obj){
  //     //         if (err) return console.log(err)
  //     //         res.status(200).json(obj)
  //     //         //     });
  //     //         // }
  //     //       });
  //     //   }
  //     // });
  //
  //   }
  //   console.log('item description body included:');
  //   purchase.save(function (err, Purchase) {
  //     if (err) return console.log(err)
  //     res.status(200).json(Purchase)
  //
  //   })
  // })

  router.put('/purchase', function (req, res) {
    console.log('update record ', req.body);
    let qry = {'_id': req.body._id}
    Purchase.findById(qry, (err, purchase) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      if (req.body.action === 'Add') {
        console.log('iam in update');
        purchase.purchaseBillNo = req.body.purchaseBillNo || purchase.purchaseBillNo,
          purchase.purchaseDate = req.body.purchaseDate || purchase.purchaseDate,
          purchase.productCreditors = req.body.productCreditors || purchase.productCreditors,
          console.log('body', req.body.itemDescription.length);
        // const nextId = Math.max.apply(null, Event.sessions.map(s => (s.sessionId.match(/\d+/g))));
        // console.log('the sid maximum id from db' , nextId);
        // let i = nextId + 1;
        for (let j = 0; j < req.body.itemDescription.length; j++) {
          let o = {
            // "sessionId": 'SID' + i++,
            "serialNo": req.body.itemDescription[j].serialNo,
            "modelNo": req.body.itemDescription[j].modelNo,
            "HSNCodeNo": req.body.itemDescription[j].HSNCodeNo,
            "companyName": req.body.itemDescription[j].companyName,
            "productType": req.body.itemDescription[j].productType,
            "qty": req.body.itemDescription[j].qty,
            "productRate": req.body.itemDescription[j].productRate,
            "gstRate": req.body.itemDescription[j].gstRate,
            "sgstRate": req.body.itemDescription[j].sgstRate,
            "totalRate": req.body.itemDescription[j].totalRate,
          };
          purchase.itemDescription.push(o);
        }
        console.log('purchase body included:', purchase);

        purchase.save(function (err, purchase) {
          if (err) return console.log(err)
          res.status(200).json(purchase)
        })
      } else if (req.body.action === 'Delete') {
        console.log('iam in delete', req.body.itemDescription[0].serialNo);

        let position = purchase.itemDescription.findIndex(i => i.serialNo === req.body.itemDescription[0].serialNo);
        // let position = Event.sessions.i(req.body.sessions[0].name);
        console.log('the position of delete', position);
        if (position !== -1) {
          purchase.itemDescription.splice(position, 1);
          purchase.save(function (err, purchase) {
            if (err) {
              res.status(500).json(err);
              return console.log(err);
            }
            res.status(200).json(purchase)
          })
        }
      }
    })
  }),

// delete event from database
    router.delete('/purchase/:id', function (req, res) {
      console.log('delete record ', req.params.id);
      let qry = {'_id': req.params.id}
      Purchase.deleteOne({'_id': req.params.id}, function (err, respRaw) {
        if (err) {
          res.status(500).json(err);
          return console.log(err);
        }
        res.status(200).json(respRaw)
      })
    })
}
