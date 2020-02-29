var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

router.get('/allProducts', function(req, res, next) {
    Item.find({}, (err, docs) => {
        if (err) {
            res.sendStatus(500).send(err)
        } else {
            res.send(docs)
        }
    });
});

router.post('/provisionUser', function(req, res, next) {
    User.create({
        bindID: req.body.bindID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }, function(err){
        if(err){
            console.log(err);
            return res.status(500).send({'error': 'Unable to provision the user. Please contact us at masseymustangs2020@gmail.com for assistance.'})
        }
        return res.send({'status': true})
    });
});

router.post('/createCheckoutSession', async function(req, res, next) {
    // console.log(req.body);
    const orders = req.body.data.cart;
    // console.log(orders)
    let line_items = [];
    for (let order in orders) {
        // console.log(order)
        const item = await Item.findByID(order);
        line_items.push({
            name: item.name,
            description: item.description,
            images: [item.image],
            amount: item.price * 100,
            currency: 'cad',
            quantity: orders[order]
        })
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });

    console.log(req.user);
    console.log(session);
    res.send({"id": session.id});
});

module.exports = router;
