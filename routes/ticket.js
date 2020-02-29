const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const TicketController = require('../controllers/TicketController');
const Ticket = require('../models/Ticket');

// Update ticket
router.post('/update', async (req, res, next) => {
    const ticketMetadata = req.body.ticketMetadata;
    const ticketId = req.body.ticketId;
    console.log(ticketId)
    if (!ticketMetadata || !ticketId) {
        return res.sendStatus(400)
    }
    try {
        await TicketController.saveTicket(ticketId, ticketMetadata);
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.toString()})
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

router.get('/', async (req, res, next) => {
    try {
        const userID = req.user.sub;
        const tickets = await Ticket.find({userID: userID});
        res.send(tickets)
    } catch (e) {
        res.sendStatus(500).send(e.toString())
    }

});

module.exports = router;