const Ticket = require('../models/Ticket');

class TicketController {
    static async saveTicket(ticketId, metadata) {
        const count = await Ticket.countDocuments({_id: ticketId}).exec();
        if (count > 0) {
            try {
                await Ticket.updateOne({_id: ticketId}, metadata);
                return new Promise(resolve => resolve)
            } catch (e) {
                return new Promise((resolve, reject) => reject(e))
            }
        } else {
            return new Promise((resolve, reject) => {
                reject(new Error("Ticket not found"))
            })
        }
    }
    static async createTicket(userID, orderID, metadata) {
        const count = await Ticket.countDocuments({metadata: metadata}).exec();
        if (count === 0) {
            try {
                await Ticket.create({
                    type: '',
                    userID: userID,
                    orderID: orderID,
                    metadata: metadata
                });
                return new Promise(resolve => resolve)
            } catch (e) {
                return new Promise((resolve, reject) => reject(e))
            }
        } else {
            return new Promise((resolve, reject) => reject(new Error('Ticket already exists')))
        }
    }
}

module.exports = TicketController;