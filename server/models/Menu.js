const mongoose = require('mongoose');
const {Schema} = mongoose;
    
const MenuSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true 
    },
    items: [],
    name:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;