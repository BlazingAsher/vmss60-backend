require('dotenv').config();

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    orderID: {
        type: String,
        required: true
    },
    metadata: {
        name: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            }
        },
        school: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        gradYear: {
            type: Number,
        },
        address: {
            line1: {
                type: String,
                required: true
            },
            line2: {
                type: String,
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
            },
            postal: {
                type: String,
            },
            country: {
                type: String,
                required: true
            },
        },
        friendsOfMassey: {
            type: String,
            required: true
        },
    }

});

module.exports = mongoose.model('Ticket', schema);