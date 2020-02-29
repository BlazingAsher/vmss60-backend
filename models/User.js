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
    bindID: {
        type: String,
        required: true,
        index: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0.0
    }

});

schema.statics.getByBindID = function (id, callback) {
    /*
    if (permissionLevel == null) {
        permissionLevel = 1;
    }*/

    this.findOne({
        bindID: id
    }, function (err, user) {
        if (err || !user) {
            return callback(err ? err : {
                error: 'User not found.'
            })

        }

        return callback(null, user);
    });
};

module.exports = mongoose.model('User', schema);