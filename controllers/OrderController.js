const User = require('../models/User');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');

class OrderController {
    static async createOrder(bindID, itemID, transID, {fulfilled = null, redeemed = null, configured = null, additional = null}) {
        let order = {
            userID: bindID,
            itemID: itemID,
            transID: transID
        };

        if (fulfilled !== null) {
            order.fulfilled = fulfilled;
        }

        if (redeemed !== null) {
            order.redeemed = redeemed;
        }

        if (configured !== null) {
            order.configured = configured;
        }

        if (additional !== null) {
            order.additional = additional;
        }

        // Order.create(order, function (err){
        //     if(err){
        //         return callback(err)
        //     }
        //
        //     return callback(null, {"status": true})
        // })
        try {
            let result = await Order.create(order);
            return new Promise((resolve, reject) => {
                resolve(result)
            })
        } catch (e) {
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
    };

    // static async markAsFulfilled(orderID, fulfilledTime = Date.now()) {
    //     await Order.update({"_id": orderID}, {"$set":{"fulfilled": true, "fulfilledTime": fulfilledTime}}).exec();
    // }

    // static async markAsConfigured(orderID, configuredTime = Date.now()) {
    //     await Order.update({"_id": orderID}, {"$set":{"configured": true, "configuredTime": configuredTime}}).exec();
    // }
}


module.exports = OrderController;