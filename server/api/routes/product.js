const Product = require('../../models/product')
const mongoose = require('mongoose')

// Get all stock from database
module.exports = function (router) {
  router.get('/products', function (req, res) {
    Product.find().exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding stock',
          error: err
        }))
  })

  router.get('/products/petty', function (req, res) {
    Product.find().exec()
      .then(docs => {
        let pet;
        console.log('IAM IN PETTY', docs.length);

        const petty = ['chimney', 'gasStove', 'stablizer', 'iornBox', 'fan', 'mixie', 'grinder'];
        pet = docs.filter(d => petty.includes(d.productType))
        console.log('IAM IN PETTY', pet);
        res.status(200).json(pet);

      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding stock',
          error: err
        }))
  })

  router.get('/product', (req, res) => {
    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'companyName') {
      sortParams = {companyName: ordering};
    } else if (queryParams.sort === 'productType') {
      sortParams = {productType: ordering};
    } else if (queryParams.sort === 'updatedOn') {
      sortParams = {updatedOn: ordering};
    } else if (queryParams.sort === 'serialNo') {
      sortParams = {serialNo: ordering};
    } else if (queryParams.sort === 'modelNo') {
      sortParams = {modelNo: ordering};
    } else if (queryParams.sort === 'HSNCodeNo') {
      sortParams = {HSNCodeNo: ordering};
    } else if (queryParams.sort === 'rate') {
      sortParams = {rate: ordering};
    } else if (queryParams.sort === 'qty') {
      sortParams = {qty: ordering};
    }
    // let sorting = queryParams.sort;
    var query = {};
    // Product.find()
    Product.find({
      '$or': [{"companyName": {$regex: filter, $options: 'i'}}, {"modelNo": {$regex: filter, $options: 'i'}},
        {"serialNo": {$regex: filter, $options: 'i'}}, {"productType": {$regex: filter, $options: 'i'}}]
    })
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {companyName: 1})
      .exec()
      .then(docs => {
        Product.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding product',
          error: err
        }))
  })

  // get specific stock from database
  // router.get('/product/:id', function (req, res) {
  //     console.log(req.params.id)
  //     Product.findById(req.params.id).exec()
  //         .then(docs => res.status(200)
  //             .json(docs))
  //         .catch(err => res.status(500)
  //             .json({
  //                 message: 'Error finding product',
  //                 error: err
  //             }))
  // })

  // get specific stock from database
  router.get('/product/serial/:code', function (req, res) {
    console.log('getting product', req.params.code);
    Product.find({serialNo: req.params.code}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding product',
          error: err
        }))
  })
  // Create new stock document...
  router.post('/product', function (req, res) {
    Product.find().exec()
      .then(docProduct => {
        console.log('customer details', docProduct);
        console.log('body details', req.body.name);

        let oldProduct = docProduct.find(cus => cus.serialNo === req.body.serialNo)
        console.log('old customer', oldProduct);
        if (oldProduct) {
          console.log('Product Already Exists')
        } else {
          let product = new Product(req.body)
          console.log('product body included:', req.body)

          product.save(function (err, product) {
            if (err) {
              res.status(500).json(err);
              return console.log(err);
            }
            res.status(200).json(product)
          })
        }
      });
  })
  // Update stock document...
  router.put('/product/:_id', function (req, res) {
    console.log('the updating full record is ', req.body)
    let qry = {_id: req.params._id}
    let doc = {
      serialNo: req.body.serialNo,
      modelNo: req.body.modelNo,
      HSNCodeNo: req.body.HSNCodeNo,
      companyName: req.body.companyName,
      productType: req.body.productType,
      qty: req.body.qty,
      rate: req.body.rate,
      gstRate: req.body.gstRate,
      sgstRate: req.body.sgstRate,
      updatedOn: req.body.updatedOn
    }
    console.log('the here iam updating record is :', doc)
    Product.updateOne(qry, doc, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(respRaw)
    })
  })

  // Update stock document...
  router.put('/products/:code', function (req, res) {
    console.log('updating stock', req.params.code, req.body.quantity, req.body.action);
    let qty = 0;
    Product.find({serialNo: req.params.code}, (err, product) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      const prod = Object.assign({}, product);
      console.log('find record ======>', prod);
      if (req.body.action === 'add') {
        console.log('main yah hoon');
        qty = parseInt(prod[0].qty) + parseInt(req.body.quantity);

      } else {
        qty = parseInt(prod[0].qty) - parseInt(req.body.quantity);
      }
      if (qty !== 0) {
        Product.updateOne({serialNo: req.params.code}, {qty: qty}, function (err, respRaw) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(respRaw)
        })
      } else {
        console.log('qty is zero');
      }
    });
  })


  // delete article from database
  router.delete('/product/:_id', function (req, res) {
    console.log('iam in delete command', req.body)
    let qry = {_id: req.params._id}
    Product.remove(qry, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err);
      }
      res.status(200).json(respRaw)
    })
  })
}
