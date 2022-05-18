const Product = require('../models/product');

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

  // console.log(req.user)

  // req.user.createProduct({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description
  // })
  // .then(result => {
  //   console.log("Product Created ....");
  //   res.redirect('/admin/products');
  // })

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id
  }).
  then(result => {
    console.log("Product Created ....");
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {

  
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   req.user.
//   getProducts({where: {id: req.params.productId}})
//   .then(products => {
//     //getting an product an array
//     const product = products[0];
//     if (!product) {
//       return res.redirect('/');
//     }
//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode,
//       product: product

//     });

//   }).catch(err => console.log(err));

  
// };

exports.getEditProduct = (req, res, next) => {

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
    const productId = req.params.productId;
    
    Product.findAll({
      where: {
        id: productId,
        userId: req.user.id
      }
    })
    .then(products => {
      console.log("Product Getting from the database");
      const product = products[0];
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product

    })
  })
  .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.findByPk(prodId)
  .then((product) => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    //save the updated content to database
    // retuen the promosie
    return product.save();
}).
then( result => {
  console.log("UPDATED PRODUCT");
  //why we redirect here
  res.redirect('/admin/products');
})
.catch(err => console.log(err));
// if we redirect here we cannot find changes in the webpages 
//because  js is run on top to bottom 
res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.findAll({where : {
    userId: req.user.id
  }}).
  then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //destroy the product 
  //one method
  Product.findByPk(prodId)
  .then((product) => {
    return product.destroy();
  })
  .then((result) => {

    console.log(result);
    console.log("product Deteletd Successfully");
  }
  )
  .catch(err => console.log(err));
  //another Method
  //Product.destroy(prodId);
  res.redirect('/admin/products');
};
