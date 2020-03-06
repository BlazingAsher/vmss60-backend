var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
const ticketRouter = require('./routes/ticket');

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

mongoose.connect(process.env.DB || 'mongodb://localhost:27017/vmss60-backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => {
    console.log(error)
});

function unless(paths, middleware){
    return function(req, res, next) {
        console.log(req.path);
        if (paths.indexOf(req.path) !== -1) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
}

app.use(unless(['/provisionUser', '/fulfillPurchase', '/allProducts'],jwtCheck));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user/', userRouter);
app.use('/ticket/', ticketRouter);

module.exports = app;

//const OrderController = require('./controllers/OrderController');
//OrderController.createOrder("auth0|5e432eca0bc1b30e93f2eacd", "5e559dba8512ca035c5d19e8", "test", {}, function() {});
