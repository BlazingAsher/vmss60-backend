var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

router.get('/provisionUser', function(req, res, next) {

    console.log(req.user.sub);

});

router.get('/createCheckoutSession', async function(req, res, next) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        name: 'T-shirt',
        description: 'Comfortable cotton t-shirt',
        images: ['https://example.com/t-shirt.png'],
        amount: 500,
        currency: 'cad',
        quantity: 1,
      }],
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });

    console.log(req.user);
    console.log(session);
    res.send({"id": session.id});
});

module.exports = router;
