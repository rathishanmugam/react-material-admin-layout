const Suspense = require('../../models/suspense')
const mongoose = require('mongoose')

// Get all stock from database
module.exports = function (router) {
  router.get('/suspense', function (req, res) {
    Suspense.find().exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding suspense',
          error: err
        }))
  })
  // router.get('/stock', (req, res) => {
  //   console.log('request to backend =====> ', req.query);
  //   const queryParams = req.query;
  //   const ordering = parseInt(queryParams.order);
  //   const filter = queryParams.filter || '';
  //   var sortParams;
  //   if (queryParams.sort === 'companyName') {
  //     sortParams = {companyName: ordering};
  //   } else if (queryParams.sort === 'productType') {
  //     sortParams = {productType: ordering};
  //   } else if (queryParams.sort === 'updatedOn') {
  //   sortParams = {updatedOn: ordering};
  // }
  //   let sorting = queryParams.sort.trim();
  //   var query = {};
  //   Stock.find({
  //     '$or': [{"companyName": {$regex: filter, $options: 'i'}},
  //       {"productType": {$regex: filter, $options: 'i'}},{"updatedOn":{$regex: filter ,$options:'i'}}]
  //   })
  //     .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
  //     .limit(parseInt(queryParams.limit))
  //     .collation({locale: "en"})
  //     .sort(sortParams || {companyName: 1})
  //     .exec()
  //     .then(docs => {
  //       Stock.count({}, function (err, count) {
  //         if (err) {
  //           return next(err);
  //         }
  //         res.status(200).json({count: count, docs: docs});
  //       });
  //     })
  //     .catch(err => res.status(500)
  //       .json({
  //         message: 'Error finding stock',
  //         error: err
  //       }))
  // })

  // get specific stock from database
  router.get('/suspense/:id', function (req, res) {
    console.log(req.params.id)
    Suspense.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding stock',
          error: err
        }))
  })

  // Create new stock document...
  router.post('/suspense', function (req, res) {
    let suspense = new Suspense(req.body)
    console.log('SUSPENSE body included:', req.body)

    suspense.save(function (err, suspense) {
      if (err) return console.log(err)
      res.status(200).json(suspense)
    })
  })
  // Update stock document...
  // router.put('/suspense/:_id', function (req, res) {
  //   console.log('the updating full record is ' , req.body)
  //   let qry = {_id: req.params._id}
  //   let doc = {
  //     serialNo:req.body.serialNo,
  //     modelNo: req.body.modelNo,
  //     companyName: req.body.companyName,
  //     productType: req.body.productType,
  //     qty:req.body.qty,
  //     updatedOn:req.body.date
  //   }
  //   console.log('the here iam updating record is :', doc)
  //   Stock.updateOne(qry, doc, function (err, respRaw) {
  //     if (err) return console.log(err)
  //     res.status(200).json(respRaw)
  //   })
  // })

  // delete article from database
  router.delete('/suspense/:_id', function (req, res) {
    console.log('iam in delete command', req.body)
    let qry = {_id: req.params._id}
    Suspense.remove(qry, function (err, respRaw) {
      if (err) return console.log(err)
      res.status(200).json(respRaw)
    })
  })
}
