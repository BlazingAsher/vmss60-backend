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
        required: true,
        default: false
    },
    redeemed: {
        type: Boolean,
        required: true,
        default: false
    },
    configured: {
        type: Boolean,
        required: true,
        default: false
    },
    transID: {
        type: String,
        required: true
    },
    additional: {
        type: mongoose.Mixed
    }
}, { toJSON: { virtuals: true } });

schema.virtual('status').get(function() {
    if(this.redeemed){
        return 'Redeemed'
    }
    else if(this.fulfilled){
        return 'Fulfilled'
    }
    else if(this.configured){
        return 'Configured'
    }
    else {
        return 'Not Configured'
    }
});

module.exports = mongoose.model('Order', schema);