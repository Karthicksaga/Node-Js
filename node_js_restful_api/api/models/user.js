const mongoose = require('mongoose');

//create a order Schema with relations Product
//ref keyword - refers to the which product we ordered. also we created the Relation Between the Product and orderSchema
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //unique: true is optimize the indexes the performance Optimization 
    //
    email : {type : String,
             required : true,
             unique : true
            },
            
    password : {type : String , required : true}
});


//mongoose.model(<schema Name> for our Internal Setup, ProductScehme Database)
module.exports = mongoose.model('User',userSchema) 