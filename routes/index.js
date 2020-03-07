var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const OrderController = require('../controllers/OrderController');
const TicketController = require('../controllers/TicketController');
const UserController = require('../controllers/UserController');
const { v4: uuidv4 } = require('uuid');
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
    console.log(req.body)
    if(!req.body.bindID || !req.body.firstName || !req.body.lastName || !req.body.email){
        return res.status(500).send({'error': 'Please fill out all required fields!'})
    }
    stripe.customers.create({
        email: req.body.email,
        name: req.body.firstName + " " + req.body.lastName,
        metadata: {
            bindID: req.body.bindID
        }
    }, function(err, customer){
        if(err){
            return res.status(500).send({'error': 'Unable to provision the user. Please contact us at masseymustangs2020@gmail.com for assistance.'})
        }
        User.create({
            bindID: req.body.bindID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            customerID: customer.id
        }, function(err2){
            if(err2){
                console.log(err2);
                return res.status(500).send({'error': 'Unable to provision the user. Please contact us at masseymustangs2020@gmail.com for assistance.'})
            }
            return res.send({'status': true})
        });

    });

});

router.post('/createCheckoutSession', async function(req, res, next) {
    if(!req.body.cart){
        return res.status(400).send({'error': 'Please fill out all required fields!'})
    }

    UserController.getUserByBindID(req.user.sub.toString(), async function(err, user){
        if(err || !user){
            return res.status(500).send({'error': 'Error creating checkout session.'});
        }
        const orders = req.body.cart;
        //console.log(orders);
        let line_items = [];
        for (let order in orders) {
            //console.log(order);
            try {
                const item = await Item.findById(order);
                line_items.push({
                    name: item.name,
                    description: item.description,
                    images: [item.image],
                    amount: item.price * 100,
                    currency: 'cad',
                    quantity: orders[order]
                });
            } catch (e) {
                console.log(e);
                return res.send(e.toString()).status(500)
            }

        }
        //console.log(line_items);
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                success_url: process.env.FRONTEND_URL + '/account?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url: process.env.FRONTEND_URL + '/cart',
                metadata: {orders: JSON.stringify(orders), user: req.user.sub.toString()}
            });

            // console.log(req.user);
            // console.log(session);
            // for (let order in orders) {
            //     let item = Item.findById(order);
            //     item = await item;
            //     if (item.type === 'ticket') {
            //         let ticket = await TicketController.createTicket(req.user.sub, session.payment_intent, order,{});
            //         await OrderController.createOrder(req.user.sub, order, session.payment_intent, {additional: {ticketID: ticket._id}});
            //     } else {
            //         await OrderController.createOrder(req.user.sub, order, session.payment_intent, {});
            //     }
            // }
            res.send({"id": session.id});
        } catch (e) {
            res.status(500).send(e.toString())
        }
    });
});

router.post('/fulfillPurchase', async (req, res) => {
    let event;

    try {
        event = req.body;
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    // console.log("event", event);

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            // let paymentIntentId = paymentIntent.id;
            // try {
            //     await OrderController.markAsFulfilled(paymentIntentId);
            // } catch (e) {
            //     console.log(e);
            //     return res.status(500).end()
            // }
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        // ... handle other event types
        case 'checkout.session.completed':
            // console.log(event);
            // console.log("disp", event.data.object.display_items);
            const checkout = event.data.object;
            let orders = JSON.parse(checkout.metadata.orders);
            for (let order in orders) {
                for (let i = 0; i < orders[order]; i++) {
                    let item = await Item.findById(order);
                    if (item.type === 'ticket') {
                        let ticket = await TicketController.createTicket(checkout.metadata.user, checkout.id, order,{});
                        await OrderController.createOrder(checkout.metadata.user, order, checkout.id, {additional: {ticketID: ticket._id}});
                    } else {
                        await OrderController.createOrder(checkout.metadata.user, order, checkout.id, {});
                    }
                }
            }
            break;
        default:
            // Unexpected event type
            return res.status(400).end();
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
});

module.exports = router;
