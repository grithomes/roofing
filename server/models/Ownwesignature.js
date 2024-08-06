const mongoose = require('mongoose');
const { Schema } = mongoose;

const ownersignSchema = new Schema({
  ownerId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'user' 
  }, 
  email: { 
    type: String, 
    required: true 
  },
  data: { 
    type: String, 
    required: true 
  },
  companyname: { 
    type: String,
  },
  createdAt:{
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('Ownersign', ownersignSchema);
