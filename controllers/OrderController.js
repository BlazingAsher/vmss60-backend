const User = require('../models/User');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');

const OrderController = {};

OrderController.createOrder = function (bindID, itemID, transID, {fullfilled =  null, redeemed = null, configured = null, additional=null}, callback){
    let order = {
        userID: bindID,
        itemID: itemID,
        transID: transID
    };

    if(fullfilled !== null){
        order.fullfilled = fullfilled;
    }

    if(redeemed !== null){
        order.redeemed = redeemed;
    }

    if(configured !== null){
        order.configured = configured;
    }

    if(additional !== null){
        order.additional = additional;
    }

    Order.create(order, function (err){
        if(err){
            return callback(err)
        }

        return callback(null, {"status": true})
    })
};


module.exports = OrderController;