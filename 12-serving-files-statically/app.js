//require path
const path = require('path');

//express js app
const express = require('express');
const bodyParser = require('body-parser');

//express routes
const app = express();

//to call routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//apps middle ware to call the body parser and Middleware and to access the request from the client
app.use(bodyParser.urlencoded({extended: false}));

//static to handle the public folder example css

app.use(express.static(path.join(__dirname, )))
app.use(express.static(path.join(__dirname, 'public')));

//handling the routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
