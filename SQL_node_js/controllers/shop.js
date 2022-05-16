const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  
  //Fetch All products 

  Product.fetchAll().
  then((result) => {
    //result is has a nested array of rows and fields
    //first array contains Product and Second array contains Meta data About Database
    products = result[0];
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err) => {
    console.log(err);
    console.log("Database Connection Close");
  })
  Product.fetchAll(products => {

    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then((products) => {

    console.log(products);
    [product,fields] = products;
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  }).catch(err => {

    console.error(err)
  })
};

//Starting Page of the Controller
// It List all the Product Is Present in the Database, if no product is Found display 
//no product in the database
exports.getIndex = (req, res, next) => {
  Product.fetchAll().
  then((result) => {

    //result is has a nested array of rows and fields
    products = result[0];
  
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });

  })
  .catch(err => {
    console.log(err);

  })
    //render method re-render the target file in which the method is called
    
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
