const mongoose = require('mongoose');
const {Schema} = mongoose;

const TransactionSchema = new Schema({
    paidamount:{
        type: Number,
    },
    paiddate:{
        type: String,
    },
    method:{
        type: String,
    },
    note:{
        type: String,
    },
    userid:{
        type: String,
    },
    invoiceid:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transactions',TransactionSchema)