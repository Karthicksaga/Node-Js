const express = require("express");
const req = require("express/lib/request");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/product");
const checkAuth = require('../middleware/check-auth');

//multer is used for store the disk storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});




//get all the Product from database
//It return the result from array of Object
router.get("/", (req, res, next) => {
    Product.find()
      .select("name price _id")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });



//Store the Product Details in Mongo Database
router.post("/",checkAuth,(req, res, next) => {
    //object of the body 
    const productData = {

        name: req.body.name,
        price: req.body.price
    }

    //instance of the Model class
    const product = new Product({

        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price : parseInt(req.body.price)

    })

    //save the models

    product.save()
    .then(result=>{
        console.log(result);

        //sent the Response immediate to the updation.
        res.status(200).json({
            message: "Product Updated Succesfully",
            product_details : {
                name : result.name,
                price : result.price,
                _id : result._id,
                typeOf:{
                    Method : "GET",
                    url : "http://localhost:3000/product/" + result._id
                }
            }
        })

    })
    .catch(err => {

        res.status(500).json({
            message: "Product Not Updated",
            error : err
        });
    });
});


//get the single Product Info
router.get("/:productId",(req,res,next) => {


    console.log("Product Id %d",req.params.productId);
    const id = req.params.productId;
    //get the product id with particular filed
    Product.findById(id)
    .select("name price _id")
    .exec()
    .then(documents => {
        //send the result only have a result, Otherwise throw a error
        if(documents){

            res.status(200);
            res.json({product_details : {

                name : documents.name,
                price : documents.price,
                _id: documents._id,
                type:{
                    method: 'GET',
                    URL: 'http://localhost:3000/products/'+documents._id
                }
            }});

            
        }else{

            res.status(404)
            .json({
                error : "no product found"
            })
        }
    }).catch(err => {console.log(err);
    
            res.status(500).json({error:err});
    
    });
    
    
})


//update the Product Details
router.patch("/:productId",(req, res,next)=>{

    //get the product id from Parameters
    const productId = req.params.productId

    console.log(productId);
    //what values should be change / or Updated
    const updateOps = {};
    //passing an Request body as {propName : <key> , value : "Value to be Given in the payload"}
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);

    Product.updateOne({_id : productId},{$set : updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + productId,
            }
        })
    })
    .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            })
        })
});

//remove the Product Id from the Mongo Db Database
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });




//upload product with image 
router.post("/productWithImage", checkAuth, upload.single('productImage'), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path 
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;