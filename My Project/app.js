const http = require('http');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
//route handling middle ware to parse the body of
app.use("/add-method", (req,res, next) => {
    
    console.log(req.body);
    //middle ware 2 runs 
    res.redirect("/success");
});

app.use("/success",(req, res, next) => {

    res.send("<h1> successfully Added the routers</h1>");
});

app.use("/",(req, res,next) => {

   res.send("<form method='POST' action='/add-method'><input type='text' name='name'><input type='submit'></form>");

});


//allows access new middleware functions
app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('In another middleware!');
     // Allows the request to continue to the next middleware in line
});

app.use((req,res, next) => {

    console.log('In third middleware!');
    // send the response with all the body
    res.send("<h1>Hello World</h1>");
    

});
const server = http.createServer(app);

server.listen(3000);
