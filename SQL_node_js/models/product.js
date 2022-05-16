const Cart = require('./cart');
const database = require('../util/database');
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  save() {
    //insert data into SQL Database

  const values = [this.title, this.description, this.price, this.imageUrl]
    
   const result = database.execute("INSERT INTO products (title, description, price, imageUrl) VALUES (?, ?, ?, ?)", values);
    return result;
  }

  static deleteById(id) {
      return database.execute("DELETE FROM products WHERE id = ?", [id]);
  }

  static getById(id) {

  }

  static fetchAll() {
   return database.execute('SELECT * FROM products');
  }

  updateById(productId){

    console.log("Product Id From Updated Products: " + productId);
    const productDetails = {}
    productDetails.title  = this.title
    productDetails.price = this.price
    productDetails.description = this.description
    productDetails.imageUrl = this.imageUrl

    console.log(productDetails);
    this.price = parseInt(this.price);
    //https://stackoverflow.com/questions/14992879/node-js-mysql-query-syntax-issues-update-where
    const values = [this.title, 
                    parseInt(this.price),
                    this.description, 
                    this.imageUrl,
                    productId]
    console.log(typeof(this.price));
    
    const result = database.execute('UPDATE products SET products.title = ?, products.price = ?, products.description = ?, products.imageUrl = ?, Where products.id = ?',values);

    console.log(result);
  
    return result;
  }

  static findById(id) {
      console.log("Getting an ID :" + id);
      return database.execute('SELECT * FROM products where id = ?', [id]);
  }
};
