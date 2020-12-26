const Petty = require('../../models/pettySales')
const mongoose = require('mongoose')

// Get all stock from database
module.exports = function (router) {
  router.get('/petty', function (req, res) {
    Petty.find().exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding Petty Product',
          error: err
        }))
  })

  router.get('/pettys', (req, res) => {
    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'billNo') {
      sortParams = {billNo: ordering};
    } else if (queryParams.sort === 'totalNetAmount') {
      sortParams = {totalNetAmount: ordering};
    } else if (queryParams.sort === 'salesDate') {
      sortParams = {salesDate: ordering};
    }
    let sorting = queryParams.sort.trim();
    var query = {};
    Petty.find({
      '$or': [{"products.companyName": {$regex: filter, $options: 'i'}},{"salesDate": {$regex: filter, $options: 'i'}},
        {"products.productType": {$regex: filter, $options: 'i'}}]
    })
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {billNo: 1})
      .exec()
      .then(docs => {
        Petty.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding petty',
          error: err
        }))
  })

  // get specific petty product from database
  router.get('/petty/:id', function (req, res) {
    console.log(req.params.id)
    Petty.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding petty',
          error: err
        }))
  })

  // Create new petty product document...
  router.post('/petty', function (req, res) {
    console.log('iam in salessavehelper ======>', req.body);
    const array = [];
    let newSale = new Petty();
    newSale.billNo = req.body.billNo,
      newSale.salesDate = new Date(req.body.salesDate).toDateString(),

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
    newSale.totalNetAmount = req.body.totalNetAmount,
      newSale.save(function (err, Sale) {
        if (err) {
          res.status(500).json(err);
          return console.log(err);
        }
        res.status(200).json(Sale)
      })

  })


  // Update stock document...
  router.put('/petty/:_id', function (req, res) {
    console.log('the updating full record is ', req.body)
    let qry = {_id: req.params._id}
    let doc = {
      serialNo: req.body.serialNo,
      modelNo: req.body.modelNo,
      companyName: req.body.companyName,
      productType: req.body.productType,
      qty: req.body.qty,
      soldOn: req.body.date
    }
    console.log('the here iam updating record is :', doc)
    Petty.updateOne(qry, doc, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(respRaw)
    })
  })

  // delete article from database
  router.delete('/petty/:_id', function (req, res) {
    console.log('iam in delete command', req.body)
    let qry = {_id: req.params._id}
    Petty.remove(qry, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(respRaw)
    })
  })
}
