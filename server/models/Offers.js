const mongoose = require('mongoose');
const {Schema} = mongoose;

const OfferSchema = new Schema({
    offerName: {
        type: String,
        required: true
    },
    customtxt: {
        type: String,
        required: true
    },

    // startTime: String,

    // endTime: String,

    createdAt: {
        type: Date,
        default: Date.now 
    },
    
    // selectedDays: [{
    //     type: String,
    //     required: true
    // }],
    searchResults: [{ label: String, value: String }],

})

module.exports = mongoose.model('Offer',OfferSchema)