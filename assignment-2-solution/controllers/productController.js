const path = require('path');
exports.getAllProduct = (req, res, next) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html')); 
}