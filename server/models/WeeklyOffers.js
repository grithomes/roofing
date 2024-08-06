const mongoose = require('mongoose');
const {Schema} = mongoose;

const WeeklyOfferSchema = new Schema({
    offerName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },

    startTime: String,

    endTime: String,

    startDate: Date, 
    
    endDate: Date,

    createdAt: {
        type: Date,
        default: Date.now 
    },
    
    selectedDays: [{
        type: String,
        required: true
    }],
    searchResults: [{ label: String, value: String }],

})

module.exports = mongoose.model('WeeklyOffer',WeeklyOfferSchema)