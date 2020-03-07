const User = require('../models/User');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');

const logger = require('winston');

const UserController = {};

UserController.getUserByBindID = function (bindID, callback){
    User.getByBindID(bindID, function(err, user){
        if(err || !user){
            if(err){
                logger.error(err);
            }
            return callback(err);
        }
        let returnUser = user.toObject();
        
        UserController.getUserOrders(bindID, function(err, orders){
            if(err){
                logger.error(err);
                return callback(err);
            }
            returnUser.orders = orders;
            
            UserController.getUserTickets(bindID, function(err, tickets){
                if(err){
                    logger.error(err);
                    return callback(err);
                }
                returnUser.tickets = tickets;
                //console.log(returnUser);
                return callback(null, returnUser);
            })
        });

    })
};

UserController.getUserOrders = function(bindID, callback){
    Order.find({
        userID: bindID
    }, function(err, orders){
        if(err){
            logger.error(err);
            return callback(err);
        }
        
        return callback(null, orders);
    })
};

UserController.getUserTickets = function(bindID, callback){
    Ticket.find({
        userID: bindID
    }, function(err, tickets){
        if(err){
            logger.error(err);
            return callback(err);
        }

        return callback(null, tickets);
    })
};

module.exports = UserController;