const mongoose = require('mongoose');

//create a schema schema or table

const productSchema = mongoose.Schema({

    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String, required: true},
    price : {type: 'number', required: true},
    productImage : {type: 'string', required: true}
},)


//mongoose.model(<schema Name> for our Internal Setup, ProductScehme Database)
module.exports = mongoose.model('Product',productSchema) 