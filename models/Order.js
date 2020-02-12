require('dotenv').config();

const mongoose   = require('mongoose');

var schema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    itemID: {
        type: String,
        required: true
    },
    fulfilled: {
        type: Boolean,
        default: false
    },
    redeemed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Order', schema);