const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserPreferenceSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true 
    },
    userId:{
        type: String,
        required: true
    },

    backgroundColor: String,
    textColor: String,
    headingTextColor: String,
    categoryColor: String,
    font: String,
    fontlink: String,
        

    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserPreference',UserPreferenceSchema)