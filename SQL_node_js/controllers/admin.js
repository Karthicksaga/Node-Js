const Product = require('../models/product');
const database = require('../util/database');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  const savePromise = product.save()
  .then()
  console.log(savePromise);
  savePromise.then(() => {

    res.redirect('/');
  })
  .catch((err) => {
    console.log(err);
    console.log("Failed to store the product");

    res.render('404',{
    pageTitle: '404 Error',
    path: '/admin/add-product',
    editing: false
    
  });
  })
 
};

exports.updateProduct = (req, res, next) => {

  //constant product id
  const productId = req.params.productId;

  console.log("Product Id: " + productId);

  const productDetails = {}

  title = req.body.title;
  imageUrl = req.body.imageUrl;
  price = req.body.price;
  description = req.body.description;

  const product = new Product(null,title,imageUrl,description,price);

  product.updateById(productId)
  .then(() => {
    console.log("Product Updated Successfully");
    res.redirect("/");
  })
  .catch(err => {
    console.log("Database not Connected: " + err.message)
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then((product) => {

    [productDetails,additionalDetails] = product
    if(!productDetails){
      return res.redirect('/');
    }
    else{
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: productDetails[0]
      });
    }
  })
  .catch((err) => {
    console.log(err);
    console.log("Database Connection Close");
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {

  console.log("Admin Product Controller Calls");
  Product.fetchAll()
  .then((results) =>{
    console.log(results);
    [rows, fields] = results;
    console.log("Inside the Admin Page controller");
    console.log(rows);
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Database Connection Close");
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
  .then(() => {
    console.log("Product Deleted");
    res.redirect('/admin/products');
  }).catch(err => {

    console.log(err);
    console.log("Database Connection Close");
  })
    
  
  
};
