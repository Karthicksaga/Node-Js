

const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');
const shopController = require('../controllers/shopController');
const errorController = require('../controllers/errorController');


router.get('/', productController.getAllProduct);
router.get('/users', shopController.users);


module.exports = router;