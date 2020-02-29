var express = require('express');
var router = express.Router();

const UserController = require('../controllers/UserController');
const TicketController = require('../controllers/TicketController');

/* GET users listing. */
router.get('/', function (req, res, next) {
    UserController.getUserByBindID(req.user.sub, function (err, user) {
        if (err || !user) {
            console.log(err);
            console.log(req.user);
            return res.status(500).send({"status": false, "message": "User not found"});
        }

        return res.send({"status": true, "user": user});
    });
});

router.put('/ticket', async (req, res, next) => {
    const ticketMetadata = req.body.ticketMetadata;
    const ticketId = req.body.ticketId;
    try {
        await TicketController.saveTicket(ticketId, ticketMetadata)
    } catch (e) {
        res.status(500).send({error: e.toString()})
    }
});

router.post('/ticket', async (req, res, next) => {
  const ticketMetadata = req.body.ticketMetadata;
  const userId = req.body.userID;

});

module.exports = router;
