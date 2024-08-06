const mongoose = require('mongoose');
const {Schema} = mongoose;

const RestaurentSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    nickname:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    zip:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: true
    },
    timezone: {
        type: String, // Add the timezone field
        required: true, // You can modify the "required" property as needed
      },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('restaurent',RestaurentSchema)