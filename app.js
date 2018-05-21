var httpProxy = require('http-proxy');
var http = require("http");
var https = require("https"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/PCDialer');
var platformClient = require('purecloud-platform-client-v2');

var indexRouter = require('./routes/index');
var campaignRouter = require('./routes/campaign');
var credentials = require('./config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', (process.env.PORT || 3000));

var sslOptions = {
    key: fs.readFileSync('https-requirements/localhost.key'),
    cert: fs.readFileSync('https-requirements/localhost.crt'),
    ca: fs.readFileSync('https-requirements/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(sslOptions, app);

var httpsPort = 443;

console.log("starting on " + httpsPort + ' (https)');
httpServer.listen(app.get('port'));
httpsServer.listen(httpsPort);

// Make PureCloud accessible to router
var pureCloudClient = platformClient.ApiClient.instance;
pureCloudClient.loginClientCredentialsGrant(credentials.clientId, credentials.clientSecret)
  .then(function() {
    console.log("--- PureCloud Authenticated ---")
  })
  .catch(function(err) {
    console.log(err);
  });

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

// Make PureCLoud accessible to our router
app.use(function(req,res,next){
  req.pureCloudClient = pureCloudClient;
  next();
});

app.use('/', indexRouter);
app.use('/campaigns', campaignRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
