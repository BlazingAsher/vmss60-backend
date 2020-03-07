const Ticket = require('../models/Ticket');
const Order = require('../models/Order');
const mongoose = require("mongoose");


class TicketController {
    static async saveTicket(ticketId, metadata) {
        let count = Ticket.countDocuments({_id: ticketId}).exec();
        let doc = Ticket.findOne({_id: ticketId});

        count = await count;
        doc = await doc;
        let order = await Order.findOne({"additional.ticketID": mongoose.Types.ObjectId(ticketId)});
        if (count > 0 && order) {
            try {
                // await Ticket.updateOne({_id: ticketId}, {"$set": {"metadata": metadata}});
                doc.metadata = metadata;
                console.log("doc", order);
                order.configured = true;
                await doc.save();
                await order.save();
                // await Order.updateOne({_id: doc.orderID}, {"$set": {"configured": true}});
            } catch (e) {
                return new Error(e)
            }
        } else {
            return new Promise((resolve, reject) => {
                reject(new Error("Ticket not found"))
            })
        }
    }
    static async createTicket(userID, orderID, itemID, metadata) {
        const count = await Ticket.countDocuments({metadata: metadata}).exec();
        if (count === 0) {
            try {
                return await Ticket.create({
                    type: 'event',
                    userID: userID,
                    orderID: orderID,
                    itemID: itemID,
                    metadata: metadata
                })
            } catch (e) {
                return new Error(e)
            }
        } else {
            return new Error('Ticket already exists')
        }
    }
}

module.exports = TicketController;