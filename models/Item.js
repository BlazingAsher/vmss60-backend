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
    priceUnit:{
    	type: String,
    	required: true,
    	default: "each"
    },
    customerPaysFee: {
    	type: Boolean,
    	required: true,
    	default: true
    },
    type: {
        type: String,
        enum: ['ticket', 'clothing', 'generic'],
        default: 'generic'
    },
    additional: {
        type: mongoose.Mixed
    }
}, { toJSON: { virtuals: true } });

schema.virtual('customerPrice').get(function() {
	if(this.customerPaysFee){
		return Math.ceil((this.price+0.3)/0.971)
	}
	else {
		return this.price;
	}
});

module.exports = mongoose.model('Item', schema);