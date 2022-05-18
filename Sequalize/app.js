const path = require('path');

const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

//import the models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItems');
const Order = require('./models/order');
const OrderItem = require('./models/orderItems');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//routing middleware
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { application } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//middleware to just register the request
app.use((req, res, next) => {

    // this will never return a user
    User.findByPk(1)
    .then(user => {
        //here we store the sequalize Object not the javascript object
        req.user = user;
        next();
    }).catch(error => console.log(error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Relate the Model using Association Model
//confiuure the association
//one user has one product
//product Belongs to user means the Product
//user id is stored in the products table
// in other words User primary key (Users ID )is stored in the product table
//In Product Table UserId is a foreign key

//p

Product.belongsTo(User,{constrains: true,
onDelete: 'CASCADE'});

//reference : https://sequelize.org/docs/v6/core-concepts/assocs/

User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem});

Product.belongsToMany(Order, {through: OrderItem});



//User.hasMany(Product); <- one user has Many Product

//Overrite the table or recreate the table
//and delete all the records{force : true} -we not recommands this 
//in production Server
sequelize.sync()
.then(result => {
    //create a User 
    // if the user is already exist
    return User.findByPk(1);
})
.then(user => {
    // if we don't have a user, create a User
    if(!user){
        return User.create({
            name: 'John',
            email: 'karthicktj3@gmail.com',
            password: '12345'
        })
    }

    return user;
})
.then(user =>{
    app.listen(3000);
})
.catch(error => {
    console.log(error);
});
