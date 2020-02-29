const Ticket = require('../models/Ticket');
const Order = require('../models/Order');


class TicketController {
    static async saveTicket(ticketId, metadata) {
        const count = await Ticket.countDocuments({_id: ticketId}).exec();
        if (count > 0) {
            try {
                await Ticket.updateOne({_id: ticketId}, {"$set": {"metadata": metadata}});
            } catch (e) {
                return e
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