const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');

const logger = require('winston');

// Update order
router.post('/update', async (req, res, next) => {
    const orderMetadata = req.body.orderMetadata;
    const orderID = req.body.orderID;

    if (!orderMetadata || !orderID) {
        return res.status(400).send({error: 'Invalid request.'});
    }

    try {
        await OrderController.updateOrder(orderID, orderMetadata, req.user.sub);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send({error: e.message || e.toString()})
    }
});

//Create new ticket
// router.post('/create', async (req, res, next) => {
//     const ticketMetadata = req.body.ticketMetadata;
//     const userID = req.body.userID;
//     const orderID = req.body.orderID;
//     try {
//         await TicketController.createTicket(userID, orderID, ticketMetadata);
//         res.status(200)
//     } catch (e) {
//         res.status(500).send(e.toString())
//     }
// });

// router.get('/', async (req, res, next) => {
//     try {
//         const userID = req.user.sub;
//         const tickets = await Ticket.find({userID: userID});
//         return res.send(tickets)
//     } catch (e) {
//         return res.send(500).send(e.toString())
//     }
//
// });

module.exports = router;