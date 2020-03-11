require('dotenv').config();

const mongoose   = require('mongoose');

var schema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    itemID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    fulfilled: {
        type: Boolean,
        required: true,
        default: false
    },
    fulfilledTime: {
        type: Date
    },
    redeemed: {
        type: Boolean,
        required: true,
        default: false
    },
    redeemedTime: {
        type: Date
    },
    configured: {
        type: Boolean,
        required: true,
        default: false
    },
    configuredTime: {
        type: Date
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

schema.virtual('statusNum').get(function() {
    let s = 0;
    if(this.configured){
        s++;
    }
    if(this.fulfilled){
        s++;
    }
    if(this.redeemed) {
        s++;
    }

    return s;
});

schema.methods.markAsConfigured = function(configuredTime = Date.now()){
  this.configured = true;
  this.configuredTime = configuredTime;
  return this.save();
};

schema.methods.markAsFulFilled = function(fulFilledTime = Date.now()){
    this.fulfilled = true;
    this.fulfilledTime = fulFilledTime;
    return this.save();
};

module.exports = mongoose.model('Order', schema);