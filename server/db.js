const mongoose = require('mongoose');
// const mongoURI = 'mongodb+srv://katariaesha02:esha00046@cluster0.swwooje.mongodb.net/gofoomern?retryWrites=true&w=majority';
// const mongoURI = 'mongodb+srv://bablubhown:mycabinets@cluster0.evzfn2i.mongodb.net/cabinets?retryWrites=true&w=majority';
const mongoURI = 'mongodb+srv://grithomesonline:grithomes@cluster0.qctzpfr.mongodb.net/roofing?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb+srv://eshajdwebservices:jdweb123@cluster0.evzfn2i.mongodb.net/invoicemanagement?retryWrites=true&w=majority';

const mongoDB = async() => {
    mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true},async (err, result) => {
    if(err) console.log('Some Error -- ', err)
        else { 
             const fetch_data = await mongoose.connection.db.collection("users");
    console.log(fetch_data,"connect");
        }
    })
   
}


module.exports = mongoDB;