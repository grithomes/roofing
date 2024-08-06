const mongoose = require('mongoose');
const {Schema} = mongoose;

const TeamSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    number:{
        type: String,
    },
    userid:{
        type: String,
    },
    password:{
        type:String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('team',TeamSchema)