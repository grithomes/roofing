const mongoose = require('mongoose');
const {Schema} = mongoose;

const CustomerSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    number:{
        type: String,
    },
    information:{
        type: String,
    },
    address1:{
        type: String,
    },
    address2:{
        type: String,
    },
    country:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    city:{
        type: String,
        // required: true
    },
    countryid:{
        type: Number,
        required: true
    },
    stateid:{
        type: Number,
        // required: true
    },
    cityid:{
        type: Number,
        // required: true
    },
    countrydata:{
        type: String,
    },
    statedata:{
        type: String,
    },
    citydata:{
        type: String,
    },
    userid:{
        type: String,
    },
    post:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customerlist',CustomerSchema)