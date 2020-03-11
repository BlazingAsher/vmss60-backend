import schema from 'async-validator';

const User = require('../models/User');
const Order = require('../models/Order');
const Item = require('../models/Item');
const logger = require('winston');

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
                logger.error(e);
                reject(e)
            })
        }
    };

    static async updateOrder(orderID, orderMetadata, userID, bypassPerms = false){
        try {
            let order = await Order.findById(orderID);

            // make sure there is an order, it has not been fulfilled, and the user has permissions
            if(order && !order.fulfiled && (bypassPerms || order.userID === userID)){
                let item = await Item.findById(order.itemID);

                // make sure the corresponding item exists
                if(item){
                    // validate item configuration if it has one
                    if(item.configuration) {
                        let validator = new schema(item.configuration);
                        try {
                            await validator.validate(orderMetadata);
                        }
                        catch (e){
                            return new Promise((resolve, reject) => {
                                reject(new Error("Invalid schema! Please check all fields and try again."));
                            })
                        }

                    }

                    try {
                        order.additional = orderMetadata;
                        await order.save();

                        return new Promise((resolve, reject) => {
                            resolve("Updated order successfully.");
                        })

                    } catch(e){
                        return new Promise((resolve, reject) => {
                            reject(e);
                        })
                    }

                }
                else {
                    return new Promise((resolve, reject) => {
                        reject(new Error("Order has no item associated with it."))
                    })
                }

            }
            else {
                if(order.fulfiled){
                    return new Promise((resolve, reject) => {
                        reject(new Error("Order has already been fulfilled!"));
                    });
                }
                if(order.userID !== userID){
                    return new Promise((resolve, reject) => {
                        reject(new Error("You do not have permission to edit that order!"));
                    });
                }
                return new Promise((resolve, reject) => {
                    reject(new Error("Order not found."));
                })
            }

        } catch(e) {
            return new Promise((resolve, reject) => {
                logger.error(e);
                reject(e);
            });
        }
    }
    // static async markAsFulfilled(orderID, fulfilledTime = Date.now()) {
    //     await Order.update({"_id": orderID}, {"$set":{"fulfilled": true, "fulfilledTime": fulfilledTime}}).exec();
    // }

    // static async markAsConfigured(orderID, configuredTime = Date.now()) {
    //     await Order.update({"_id": orderID}, {"$set":{"configured": true, "configuredTime": configuredTime}}).exec();
    // }
}


module.exports = OrderController;