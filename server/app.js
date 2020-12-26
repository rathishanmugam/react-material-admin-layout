const express = require('express')
const app = express()
const api = require('./api')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
mongoose.connect(process.env.MONGODB_URL);
app.set('port', (process.env.PORT || 8000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use('/api', api)
app.use(express.static('static'))

app.use(morgan('dev'))

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  res.json(err)
})

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// MongoDB URL from the docker-compose file
// const dbHost = 'mongodb://database/HomeApplianceAPI';
// // Connect to mongodb
// mongoose.connect(dbHost);
//
// // mongoose.connect('mongodb://localhost:27017/HomeApplianceAPI' ,  { useNewUrlParser: true , useUnifiedTopology: true} )
// const db = mongoose.connection
//
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function () {
//   console.log('Connected to MongoDB')

  app.listen(app.get('port'), function () {
    console.log('API Server Listening on port ' + app.get('port') + '!')
  })
// })



// var express = require('express');
// var app = express();
// var jwt = require('express-jwt');
// var jwks = require('jwks-rsa');
//
// var port = process.env.PORT || 8080;
//
// var jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://ranjith-andavar.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'http://localhost:8081/api/',
//   issuer: 'https://ranjith-andavar.auth0.com/',
//   algorithms: ['RS256']
// });
//
// app.use(jwtCheck);
//
// app.get('/authorized', function (req, res) {
//   res.send('Secured Resource');
// });
////CORS middleware
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'example.com');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//
//     next();
// }
// app.listen(port);
