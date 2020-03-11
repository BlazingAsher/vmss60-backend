require('dotenv').config();

const mongoose   = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['ticket', 'clothing', 'generic'],
        default: 'generic'
    },
    additional: {
        type: mongoose.Mixed
    },
    configuration: {
        type: mongoose.Mixed
    }
});

module.exports = mongoose.model('Item', schema);