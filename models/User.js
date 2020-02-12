require('dotenv').config();

const mongoose   = require('mongoose');

var schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },


});

module.exports = mongoose.model('User', schema);