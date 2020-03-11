const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const Item = require('../models/Item');

const logger = require('winston');

// router.post('/update', async (req, res, next) => {
//     const orderMetadata = req.body.orderMetadata;
//     const orderID = req.body.orderID;
//     console.log(orderID);
//     if (!orderMetadata || !orderID) {
//         return res.status(400).send({error: 'Invalid request.'});
//     }
//     try {
//         await OrderController.updateOrder(orderID, orderMetadata);
//         res.sendStatus(200);
//     } catch (e) {
//         console.log(e);
//         res.status(500).send({error: e.message || e.toString()})
//     }
// });

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

router.get('/:item_id', async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.item_id, {configuration: 1}).lean();
        return res.send(item);
    } catch (e) {
        logger.error(e);
        return res.status(500).send({error: "Unable to locate the requested item."});
    }

});

module.exports = router;