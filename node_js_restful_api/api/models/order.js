const mongoose = require('mongoose');

//create a order Schema with relations Product
//ref keyword - refers to the which product we ordered. also we created the Relation Between the Product and orderSchema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});


//mongoose.model(<schema Name> for our Internal Setup, ProductScehme Database)
module.exports = mongoose.model('Order',orderSchema) 