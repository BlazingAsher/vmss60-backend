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

module.exports = router;
