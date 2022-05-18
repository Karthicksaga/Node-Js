const Product = require('../models/product');
const Cart = require('../models/cart');

// to get the products from database using the module
exports.getProducts = (req, res, next) => {
  //find all the products fromt the database
  Product.findAll()
    .then((product) => {
      //render the page product-list 
      res.render('shop/product-list', {
        prods: product,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// get product individual product and render it to the page
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  //method
  //find all only fetch by particular id
  Product.findAll({where: {id: prodId}})
  .then(product => {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products'
    });

  }).catch((error) => {

    console.log(error);
  })

  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {

    //get the cart data from the database for the particular user
    req.user.getCart()
    .then(cart => {
      //get the product data from the database
      //because cart is Associated with the products
      //means the cart with the product

      return cart.getProducts()
      .then(products => {
        res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
    });
  })
})
    .catch(err => console.log(err));
}
//get the product from the cart and check if the product
// is already exist in the cart add the quantity
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("Cart Data :");
  let newQuantity = 1;

  let fetchCart;
  req.user
  .getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts({
      where : {
        id: prodId
      }
    })
  }).then((products) => {
    let product;
    //it return the array of the products
    if(products.length > 0){
       product = products[0]
    } 
    

    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return fetchCart.addProduct(product, {
        through: {
          quantity: newQuantity
        }
      })
      .catch(err => console.log(err));
    }
    //add new product so we need to get the details of the product
    return Product.findByPk(prodId)
    .then(product => {
      //cart is a many to may relation ship 
      return fetchCart.addProduct(product,{
        through: {
          quantity: newQuantity
        }
      })
    }
    )
    .catch(err => {
      console.log("Error in getting the product from the database", err);
    })
  }).then(() => {
    res.redirect("/cart");
  })
  
  .catch((error) => {

  })
};

//delete product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  //get the product from cart
  let fetchCart;
  req.user.
  getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts({
      where: {
        id: prodId
      }
    })
  })
  .then(products => {

    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

// get order from the database
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
