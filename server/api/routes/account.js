const Account = require('../../models/account')
const Tally = require('../../models/tally')

const mongoose = require('mongoose')
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); // Validate JWT scopes
// process.env.REACT_APP_AUTH0_AUDIENCE = 'http://localhost:8081';
// process.env.REACT_APP_AUTH0_DOMAIN = 'rathireactjsconsulting-dev.auth0.com';
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: 'https://andavar-angular.auth0.com/.well-known/jwks.json'

  }),

  // Validate the audience and the issuer.
  audience:  "inventry-api",
  issuer: 'https://andavar-angular.auth0.com/',

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ["RS256"]
});

function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user['http://localhost3000/roles'];
    console.log('assigned user', assignedRoles);
    console.log('assigned role', role);
    console.log('req', req.user);

    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      console.log('Sorry ,You Are Having Insufficient role');
      return res.status(401).send("Insufficient role");
    }
  };
}

module.exports = function (router) {

  router.get('/', checkJwt, function (req, res) {
    Account.find({}, function (err, storedUsers) {
      if (err) {
        return res.status(500).send({ error: 'No account details found(check whether authenticated or not' });
      } else {
        return res.status(200).send(storedUsers);
      }
    });

  });


  // router.get('/accounts',checkJwt,checkScope(["read:account"]), function (req, res) {
  router.get('/accounts', checkJwt,function (req, res) {

    console.log('the request body is:', req.headers["x-token"]);

    Account.find().exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })

  router.get('/accounts/tally', function (req, res) {
    Account.find().exec()
      .then(docs => {
        let totCredit = 0;
        let totDebit = 0;
        let totBalance = 0;
        for (let j = 0; j < docs.length; j++) {
          const start = new Date(docs[j].createdOn);
          const now = new Date(Date.now());
          if (start.toDateString() === now.toDateString()) {
            console.log('IAM CURRENT');
            totCredit += docs[j].credit;
            totDebit += docs[j].debit;
            totBalance = totCredit - totDebit;
          }
        }
        console.log('THE TOTAL DEBIT CREDIT BALANCE ====>', totDebit, totCredit, totBalance);
        const obj = {
          createdOn: new Date(Date.now()),
          netCredit: totCredit,
          netDebit: totDebit,
          netBalance: totBalance,
        };

        var end = new Date(Date.now());
        var inputDate = new Date(end.toISOString());
        let d = new Date(Date.now());
        d.setDate(d.getDate() + 1);
        let dd = new Date(Date.now());
        dd.setDate(d.getDate() - 1);

        const date1 = new Date(d).toISOString().replace(/T.*/, '').split('-').join('-');
        const date2 = new Date(Date.now()).toISOString().replace(/T.*/, '');
        // const date2 = new Date(Date.now()).toISOString().replace(/T.*/, '');


        var outputDate = new Date(d.toISOString());
        Tally.find({createdOn: {$gte: date2, "$lt": date1}}, (err, tally) => {

          if (err) {
            console.log(`*** CustomersRepository.editCustomer error: ${err}`);
            return callback(err);
          }
          console.log('THE FIND TALLY REC =====>', tally);
          if (tally.length !== 0) {
            console.log('IAM IN UPDATE');
            updates = {netCredit: totCredit, netDebit: totDebit, netBalance: totBalance},

              Tally.update({createdOn: {$gte: date2, "$lt": date1}}, updates, function (err, respRaw) {
                if (err) {
                  res.status(500).json(err);
                  return console.log(err)
                }
                res.status(200).json({tally: tally, docs: docs, respRaw: respRaw})
              })
          } else if (tally.length === 0) {
            console.log('IAM IN SAVE');
            let tallys = new Tally(obj)
            tallys.save(function (err, user) {
              if (err) {
                res.status(500).json(err);
                return console.log(err)
              }
              res.status(200).json({tally: tally, docs: docs, user: user})
            })
          }
        })
          .catch(err => res.status(500)
            .json({
              message: 'Error finding author',
              error: err
            }))
      })
  })
  // router.get('/account/:id',checkJwt,checkScope(["read:account"]), function (req, res) {
  router.get('/account/:id', function (req, res) {

    Account.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })

  // router.get('/user', (req, res) => {
  //     console.log('iam innnnnn', req.query);
  //     const queryParams = req.query;
  //     const ordering = parseInt(queryParams.order);
  //     var sortParams;
  //     if (queryParams.sort === 'first') {
  //         sortParams = {first: ordering};
  //
  //     } else if (queryParams.sort === 'last') {
  //         sortParams = {last: ordering};
  //
  //     } else if (queryParams.sort === 'location') {
  //         sortParams = {location: ordering};
  //
  //     } else {
  //         sortParams = {hobby: ordering};
  //
  //     }
  //     let sorting = queryParams.sort.trim();
  //     var query = {};
  //     var aggregate = User.aggregate();
  //     const endDt = new Date(Date.UTC(2019, 9, 1))
  //     // aggregate.match({added : { $lt: endDt } })
  //     aggregate.match({added: {'lt': endDt}})
  //         .group({})
  //     const options = {
  //         select: '  first last email phone location hobby ',
  //         sort: sortParams || {first: 1},
  //         page: parseInt(queryParams.page) || 1,
  //         limit: parseInt(queryParams.limit) || 4,
  //         collation: {
  //             'locale': 'en'
  //         }
  //
  //     };
  //     var pageOptions = {
  //         collation: {
  //             'locale': 'en'
  //         },
  //         page: parseInt(queryParams.page) || 1,
  //         limit: parseInt(queryParams.limit) || 5,
  //         sort: sortParams || {first: 1}
  //     }
  //     // User.paginate({}, {collation:pageOptions.collation, page: pageOptions.page, limit: pageOptions.limit,  sort: pageOptions.sort })
  //       User.paginate(query, options)
  //
  //     // User.find()
  //     // // .skip(parseInt(queryParams.page)*parseInt(queryParams.limit))
  //     //     .limit(parseInt(pageOptions.limit))
  //     //     .collation({locale: "en"})
  //     //     .sort(sortParams || {first: 1})
  //     //     .exec()
  //
  //
  //         .then(docs => res.status(200)
  //             .json(docs))
  //         .catch(err => res.status(500)
  //             .json({
  //                 message: 'Error finding User',
  //                 error: err
  //             }))
  // })

  // router.get('/account',checkJwt,checkScope(["read:account"]), (req, res) => {
  router.get('/account', (req, res) => {

    console.log('request to backend =====> ', req.query);
    const queryParams = req.query;
    const ordering = parseInt(queryParams.order);
    const filter = queryParams.filter || '';
    var sortParams;
    if (queryParams.sort === 'particulars') {
      sortParams = {particulars: ordering};

    } else if (queryParams.sort === 'createdOn') {
      sortParams = {createdOn: ordering};

    } else if (queryParams.sort === 'accountNo') {
      sortParams = {accountNo: ordering};
    } else if (queryParams.sort === 'credit') {
      sortParams = {credit: ordering};
    } else if (queryParams.sort === 'debit') {
      sortParams = {debit: ordering};
    }
    // } else {
    //   sortParams = {hobby: ordering};
    //
    // }
    let sorting = queryParams.sort;
    var query = {};
    Account.find({
      '$or': [{"createdOn": {$regex: filter, $options: 'i'}}, {"particulars": {$regex: filter, $options: 'i'}}]
      // {
      //   "particulars": {
      //     $regex: filter,
      //     $options: 'i'
      //   }
      // }, {"location": {$regex: filter, $options: 'i'}}, {"hobby": {$regex: filter, $options: 'i'}}]
    })
    // .populate('first')
    // .populate({
    //     path: 'first',
    //     match: { first: { $in: filter }},
    //      select: '_id id first last email phone location hobby added'
    // })
    // .where('first').in(filter)
      .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
      .limit(parseInt(queryParams.limit))
      .collation({locale: "en"})
      .sort(sortParams || {accountNo: -1})
      .exec()
      .then(docs => {
        // let credit = 0;
        // let debit = 0;
        // let balance = 0;
        // console.log('the dosc are', docs);
        // for (let j = 0; j < docs.length; j++) {
        //   const start = docs[j].createdOn;
        //   const now = new Date().toDateString();
        //   const day = now.toDateString();
        //   console.log('the date are===>', day,now);
        //   credit = credit + parseInt(docs[j].credit, 10);
        //   debit = debit + parseInt(docs[j].debit, 10);
        // }
        // balance = credit - debit;
        // console.log('iam here', credit, debit, balance);
        // docs[credit] = credit;
        // docs[debit] = debit;
        // docs[balance] = balance;
        Account.count({}, function (err, count) {
          if (err) {
            return next(err);
          }

          res.status(200).json({count: count, docs: docs});
        });
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding User',
          error: err
        }))
  })

  // router.post('/account',checkJwt,checkScope(["post:account"]),function (req, res) {
  router.post('/account', function (req, res) {
    req.body.accountDate = new Date();
    req.body.createdOn = new Date(req.body.createdOn).toDateString()
    console.log('the req body is =====>', req.body);
    let account = new Account(req.body)
    console.log(req.body)
    account.save(function (err, user) {
      if (err) {
        res.status(500).json(err);
        return console.log(err)
      }
      res.status(200).json(user)
    })
  })

  router.post('/accounts', function (req, res) {
      let d = new Date(Date.now());
      d.setDate(d.getDate() );
      req.body.createdOn = d.toDateString();

      console.log('the req body DATE is =====>', req.body.createdOn);

      const day = new Date(d).toISOString().replace(/T.*/, '').split('-').reverse().join('-')
      // req.body.particulars =`carryForward ${req.body.data.createdOn.slice(0,10)}`;
      req.body.particulars = `carryForward ${day}`;
      const date = new Date((req.body.data.createdOn)).toDateString();
      req.body.credit = req.body.data.netBalance;
      req.body.accountNo = req.body.data.accountNo;
      req.body.debit = 0;
      req.body.balance = 0;

      console.log('the req body is =====>', req.body.data, day, date);

      Account.find().exec()
        .then(docAccount => {
          // let oldCustomer = docAccount.find(cus => cus.particulars === req.body.particulars && cus.createdOn.split(0,10) === date.split(0,10))
          const oldCustomer = docAccount.find(acc => (acc.particulars.includes(`carryForward ${date}`)));

          if (oldCustomer) {
            console.log('Entry Already Exists')
          } else if (!oldCustomer) {
            console.log('the req body going to be saved is =====>', req.body);
            let account = new Account(req.body)
            account.save(function (err, user) {
              if (err) {
                res.status(500).json(err);
                return console.log(err)
              }
              res.status(200).json(user)
            })
          }
        })
    }
  )
// router.put('/account/:_id', checkJwt,checkScope(["update:account"]),function (req, res) {
  router.put('/account/:_id', function (req, res) {

    console.log('account record body =====>', req.body)
    let qry = {_id: mongoose.Types.ObjectId(req.params._id)}
    let doc = {
      accountNo: req.body.accountNo,
      particulars: req.body.particulars,
      credit: req.body.credit,
      debit: req.body.debit,
      createdOn: new Date(req.body.createdOn).toDateString(),
    }
    console.log(doc)
    Account.update(qry, doc, function (err, respRaw) {
      if (err) {
        res.status(500).json(err);
        return console.log(err)
      }
      res.status(200).json(respRaw)
    })
  }),
    // delete user from database
    // router.delete('/account/:_id',checkJwt,checkScope(["delete:account"]),function (req, res) {
    router.delete('/account/:_id', function (req, res) {

      console.log('iam in delete record', req.body)
      let qry = {_id: mongoose.Types.ObjectId(req.params._id)}
      Account.remove(qry, function (err, respRaw) {
        if (err) {
          res.status(500).json(err);
          return console.log(err)
        }
        res.status(200).json(respRaw)
      })
    })

}



// / Route for creating a new Review and updating Product "review" field with it
// app.post("/product/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Review.create(req.body)
//     .then(function(dbReview) {
//       // If a Review was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new Review
//       // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//
// return db.Product.findOneAndUpdate({ _id: req.params.id }, {$push: {reviews: dbReview._id}}, { new: true });
// })
// .then(function(dbProduct) {
//   // If we were able to successfully update a Product, send it back to the client
//   res.json(dbProduct);
// })
//   .catch(function(err) {
//     // If an error occurred, send it to the client
//     res.json(err);
//   });
// });
//
// async function updatePublisher(gameId) {
//   const game = await Game.findById(gameId);
//   game.publisher.companyName = 'Epic Games';
//   game.publisher.website = 'https://epicgames.com/';
//   game.save();
// }
