const Creditor = require('../../models/creditor')
const Address = require('../../models/address')
const mongoose = require('mongoose')

module.exports = function (router) {
  // router.get('/creditors', function (req, res) {
  //   console.log('the request body is:')
  //
  //   Creditor.find().populate({path: 'address'}).exec()
  //     .then(docs => res.status(200)
  //       .json(docs))
  //     .catch(err => res.status(500)
  //       .json({
  //         message: 'Error finding creditor',
  //         error: err
  //       }))
  // })

  router.get('/creditors', function (req, res) {
    console.log('the request body is:')
    const pipeline = [
      { "$lookup": {
          "from": "address",
          "localField": "address",
          "foreignField": "_id",
          "as": "address"
        }},
      { "$unwind": "$address" }
    ]
    Creditor.aggregate(pipeline).exec()
      .then(docs =>{ console.log('THE AGGREGATION CREDITOR RECORD IS ====>' , docs); res.status(200).json(docs)})

      .catch(err => res.status(500)
        .json({
          message: 'Error finding creditor',
          error: err
        }))
  })

  router.get('/creditor', (req, res) => {
    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'name') {
      sortParams = {name: ordering};
    } else if (queryParams.sort === 'gstIM') {
      sortParams = {gstIM: ordering};

    } else if (queryParams.sort === 'address') {
      sortParams = {address: ordering};
    }
    // let sorting = queryParams.sort;
    var query = {};
    Creditor.find({
      '$or': [{"name": {$regex: filter, $options: 'i'}},{"email": {$regex: filter, $options: 'i'}},
        {"gstIM": {$regex: filter, $options: 'i'}}]
    }).populate({path: 'address'})
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {createdOn: -1})
      .exec()
      .then(docs => {
        console.log('the query without aggregation======>',docs);
        Creditor.count({}, function (err, count) {
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

  router.get('/creditors/:name', function (req, res) {
    console.log('iam in name', req.params.name);
    Creditor.find({name: req.params.name}).populate({path: 'address'}).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding customer',
          error: err
        }))
  })

  router.post('/creditor', function (req, res) {
    Creditor.find().exec()
      .then(docCreditor => {
        console.log('oldCreditor details', docCreditor);
        console.log('body details', req.body.name);

        let oldCreditor = docCreditor.find(cus => cus.name === req.body.name)
        console.log('old oldCreditor', oldCreditor);
        if (oldCreditor) {
          console.log('Creditor Already Exists')
        } else {
          let newAddress = {
            'street': req.body.address.street,
            'city': req.body.address.city,
            'state': req.body.address.state,
            'zipCode': req.body.address.zipCode
          }
          const address = new Address(newAddress);
          console.log('th request body is =====>', req.body);
          address.save().then(address => {
            console.log('found id ', address._id);
            let creditor = new Creditor(req.body)
            creditor.address = mongoose.Types.ObjectId(address._id),
              console.log('address record is', creditor);
            creditor.save(function (err, creditor) {
              if (err) {
                res.status(500).json(err);
                return console.log(err);
              }
              res.status(200).json({creditor: creditor, docCreditor: docCreditor, address: address})
            });
          });
        }
      });
  });
  router.put('/creditor/:addr/:id', function (req, res) {
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
          // id: req.body.id,
          name: req.body.data.name,
          gstIM: req.body.data.gstIM,
          email: req.body.data.email,
          address: mongoose.Types.ObjectId(req.body.addr),
          phone1: req.body.data.phone1,
          phone2: req.body.data.phone2,
          mobile1: req.body.data.mobile1,
          mobile2: req.body.data.mobile2,
          createdOn: req.body.createdOn

          // name: req.body.name,
          // gstIM: req.body.gstIM,
          // email: req.body.email,
          // address: mongoose.Types.ObjectId(req.params.addr),
          // phone1: req.body.phone1,
          // phone2: req.body.phone2,
          // mobile1: req.body.mobile1,
          // mobile2: req.body.mobile2,
          // createdOn: req.body.createdOn
        }

        Creditor.updateOne(query, doc, function (err, respRaw) {
          if (err) {
            res.status(500).json(err);
            return console.log(err);
          }
          res.status(200).json(respRaw)
        })
      })
    })
  }),

    router.delete('/creditor/:addr/:id', function (req, res) {
      console.log('iam in delete record', req.params);
      let qry = {_id: mongoose.Types.ObjectId(req.params.id)};
      let query = {_id: mongoose.Types.ObjectId(req.params.addr)};
      Creditor.deleteOne(qry).then(respRaw => {
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







