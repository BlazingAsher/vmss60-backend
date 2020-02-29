require('dotenv').config();

const mongoose   = require('mongoose');

var schema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('Ticket', schema);