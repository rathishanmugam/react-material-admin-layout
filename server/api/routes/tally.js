const Tally = require('../../models/tally')

module.exports = function (router) {
  router.get('/tally', function (req, res) {
    let d = new Date(Date.now());
    d.setDate(d.getDate() + 1);
    const date1 = new Date(d).toISOString().replace(/T.*/, '').split('-').join('-');;
    const date2 = new Date(Date.now()).toISOString().replace(/T.*/, '');
    Tally.find({createdOn: {$gte: date2, "$lt": date1}}).exec()
      .then(docs => res.status(200)
        .json({docs: docs}))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding balance',
          error: err
        }))
  })

  router.get('/tally/yesterday', function (req, res) {
    let d = new Date(Date.now());
    d.setDate(d.getDate() - 1);
    const date1 = new Date(d).toISOString().replace(/T.*/, '').split('-').join('-');;
    const date2 = new Date(Date.now()).toISOString().replace(/T.*/, '');
    Tally.find({createdOn: {$gte: date1, "$lt": date2}}).exec()
      .then(docs => res.status(200)
        .json({docs: docs}))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding balance',
          error: err
        }))
  })

  router.put('/tally', function (req, res) {
    // let tally = new Tally(req.body)
    let query = {createdOn: new Date()}
      Tally.find({createdOn: new Date()}, (err, tally) => {
      if (err) {
        console.log(`*** CustomersRepository.editCustomer error: ${err}`);
        return callback(err);
      }
      if(tally){
        update = { netCredit: req.body.netCredit,netDebit:req.body.netDebit,netBalance:req.body.netBalance },
          Tally.update(query, update, function (err, respRaw) {
            if (err) {
              res.status(500).json(err);
              return console.log(err)
            }
            res.status(200).json(respRaw)
          })
      }else  if(!tally){
        let tally = new Tally(req.body)
        console.log(req.body)
        tally.save(function (err, user) {
          if (err) {
            res.status(500).json(err);
            return console.log(err)
          }
          res.status(200).json(user)
        })
      }
   })
})
}
