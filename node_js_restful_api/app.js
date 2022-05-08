const express = require('express');
const app = express();
//logging function  for hadling the  request
const morgon = require('morgan');
//body parser for
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//these are the middleware to see how things going in the routers
//get the logging interface for more details how the server handling an request

//These code parts are the middle ware parts
app.use(morgon('dev'));

app.use(bodyParser.urlencoded({extended: false}));
//encoded the parser body
app.use(bodyParser.json());

//CORS - Cross-Origin Resource Sharing - you shiuld learn the concepts
//syntax
//mongose.connect('Path of the database', disconnection Object)
mongoose.connect('mongodb+srv://karthick:' + 
process.env.MONGO_DB_PASSWORD + '@cluster0.xaf0e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
//Roters Files Definitions all these handled
const productRouters = require("./api/routers/product");
const orderRouters = require("./api/routers/orders");
const fileRouters = require("./api/routers/fileStorage");
const userRouters = require("./api/routers/user");

//routers should pass  the requests
app.use('/products',productRouters);
app.use("/orders",orderRouters);
app.use("/filestore",fileRouters);
app.use("/user",userRouters);

app.use((req,res,next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',"Origin",
    "X-requested-With","Content-Type","Accept","Authorization");

    if(req.method == 'OPTIONS'){

        res.header('Access-Control-Allow-Methods','Put',
        'Post','PATCH',"DELETE")

        return res.status(200).json({});
    }

    //middleware to see the server
    next();
})

// we cannot found an routers
//here handles the error and requests
app.use((req, res, next) => {

    const error = new Error("Not found");
    error.status = 404;
    //if cannot found the request next routers forward the request as error

    next(error);
})


//route the error handler if the router doesnot found in our apps
app.use((error,req, res, next) => {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
//send the response
module.exports = app;