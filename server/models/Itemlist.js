const mongoose = require('mongoose');
const {Schema} = mongoose;

const ItemsSchema = new Schema({
    itemname: {
        type: String,
    },

    description: {
        type: String,
    },
    price: {
        type: Number,
    },

    userid: { 
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('itemlist',ItemsSchema)