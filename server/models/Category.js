const mongoose = require('mongoose');
const {Schema} = mongoose;

const CategorySchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true 
    },
    name:{
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('category',CategorySchema)