var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');

var app = express();
var cors = require('cors');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://vmss60.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://api.vmss60.com',
    issuer: 'https://vmss60.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
