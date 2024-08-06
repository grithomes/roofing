const mongoose = require('mongoose');
const {Schema} = mongoose;

const signatureSchema = new Schema({
    data: String,
  });
  

module.exports = mongoose.model('Signature',signatureSchema)