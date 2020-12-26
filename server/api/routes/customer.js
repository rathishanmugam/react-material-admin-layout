const Customer = require('../../models/customer')
const Address = require('../../models/address')
const mongoose = require('mongoose')

module.exports = function (router) {
  router.get('/customers', function (req, res) {
    console.log('the request body is:', req.body)

    Customer.find().populate({path: 'address'}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })

  router.get('/customer', (req, res) => {
    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'name') {
      sortParams = {name: ordering};
    } else if (queryParams.sort === 'address') {
      sortParams = {address: ordering};
    } else if (queryParams.sort === 'email') {
      sortParams = {email: ordering};
    } else if (queryParams.sort === 'createdOn') {
      sortParams = {createdOn: ordering};
    }
    // let sorting = queryParams.sort;
    var query = {};
    // Product.find()
    Customer.find({
      '$or': [{"name": {$regex: filter, $options: 'i'}},{"email": {$regex: filter, $options: 'i'}}]
    }).populate({path: 'address'})  //, select: 'street state city zipCode'})

      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {createdOn: -1})
      .exec()
      .then(docs => {
        // console.log('POPULATED ADDRESS',docs);
        // for (let j = 0; j < docs.length; j++) {
        //   let add = `${docs[j].address.street} , ${docs[j].address.city} , ${docs[j].address.state}`;
        // }
        Customer.count({}, function (err, count) {
          if (err) {
            return next(err);
          }
          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding Creditor',
          error: err
        }))
  })

  router.get('/customer/:id', function (req, res) {
    Customer.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding customer',
          error: err
        }))
  })


  // router.get('/customer', (req, res) => {
  //     console.log('request to backend =====> ', req.query);
  //     const queryParams = req.query;
  //     const ordering = parseInt(queryParams.order);
  //     const filter = queryParams.filter || '';
  //     var sortParams;
  //     if (queryParams.sort === 'name') {
  //         sortParams = {name: ordering};
  //     } else if (queryParams.sort === 'createdOn') {
  //         sortParams = {createdOn: ordering};
  //     }
  //     let sorting = queryParams.sort.trim();
  //     var query = {};
  //     Customer.find({
  //         '$or': [{"name": {$regex: filter, $options: 'i'}},
  //           {"createdOn": {$regex: filter, $options: 'i'}}]
  //     })
  //         .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
  //         .limit(parseInt(queryParams.limit))
  //         .collation({locale: "en"})
  //         .sort(sortParams || {name: 1})
  //         .exec()
  //         .then(docs => {
  //             Customer.count({}, function (err, count) {
  //                 if (err) {
  //                     return next(err);
  //                 }
  //                 res.status(200).json({count: count, docs: docs});
  //             });
  //         })
  //         .catch(err => res.status(500)
  //             .json({
  //                 message: 'Error finding Customer',
  //                 error: err
  //             }))
  // })

  router.post('/customer', function (req, res) {
    Customer.find().exec()
      .then(docCustomer => {
        console.log('customer details', docCustomer);
        console.log('body details', req.body.name);

        let oldCustomer = docCustomer.find(cus => cus.name === req.body.name && cus.address === req.body.address)
        console.log('old customer', oldCustomer);
        if (oldCustomer) {
          console.log('Customer Already Exists')
        } else {
          let newAddress = {
            'street': req.body.address.street,
            'city': req.body.address.city,
            'state': req.body.address.state,
            'zipCode': req.body.address.zipCode
          }
          const address = new Address(newAddress);
          console.log(req.body)
          address.save().then(address => {
            console.log('found id ', address._id);
            let customer = new Customer(req.body)
            customer.address = mongoose.Types.ObjectId(address._id),
              console.log('address record is', customer);
            customer.save(function (err, customer) {
              if (err) {
                res.status(500).json(err);
                return console.log(err);
              }
              res.status(200).json({customer: customer, docCustomer: docCustomer, address: address})
            });
          });
        }
      });
  });
  router.put('/customer/:addr/:id', function (req, res) {
    console.log('update record', req.body)
    let qry = {_id: mongoose.Types.ObjectId(req.params.addr)}
    Address.findById(qry, (err, Addres) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      console.log('th request body is =====>', req.body);

      Addres.street = req.body.data.address.street || Addres.street,
        Addres.city = req.body.data.address.city || Addres.city,
        Addres.state = req.body.data.address.state || Addres.state,
        Addres.zipCode = req.body.data.address.zipCode || Addres.zipCode

      // Addres.street = req.body.address.street || Addres.street,
      //   Addres.city = req.body.address.city || Addres.city,
      //   Addres.state = req.body.address.state || Addres.state,
      //   Addres.zipCode = req.body.address.zipCode || Addres.zipCode
      Addres.save().then(address => {
        console.log('after address stored', address);
        let query = {_id: mongoose.Types.ObjectId(req.params.id)}
        let doc = {
          id: req.body.id,
          name: req.body.data.name,
          email: req.body.data.email,
          address: mongoose.Types.ObjectId(req.body.addr),
          phone1: req.body.data.phone1,
          phone2: req.body.data.phone2,
          mobile1: req.body.data.mobile1,
          mobile2: req.body.data.mobile2,
          createdOn: req.body.createdOn

          // name: req.body.name,
          // email: req.body.email,
          // address: mongoose.Types.ObjectId(req.params.addr),
          // phone1: req.body.phone1,
          // phone2: req.body.phone2,
          // mobile1: req.body.mobile1,
          // mobile2: req.body.mobile2,
          // createdOn: req.body.createdOn
        }

        Customer.updateOne(query, doc, function (err, respRaw) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(respRaw)
        })
      })
    })
  }),
    // delete user from database
    router.delete('/customer/:addr/:id', function (req, res) {
      console.log('iam in delete record', req.params);
      let qry = {_id: mongoose.Types.ObjectId(req.params.id)};
      let query = {_id: mongoose.Types.ObjectId(req.params.addr)};
      Customer.deleteOne(qry).then(respRaw => {
        Address.deleteOne(query, function (err, respRaw) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(respRaw)
        });
      });
    });

}







