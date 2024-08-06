const mongoose = require('mongoose');
const {Schema} = mongoose;

const DepositSchema = new Schema({
    deposit_uniqueid: { 
        type: Schema.Types.ObjectId, 
        default: mongoose.Types.ObjectId,
        unique: true 
    },
    depositamount:{
        type: Number,
    },
    duedepositdate:{
        type: String,
    },
    depositpercentage:{
        type: Number,
        default: 0,
    },
    method:{
        type: String,
        default:'Pending',
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

module.exports = mongoose.model('Deposit',DepositSchema)