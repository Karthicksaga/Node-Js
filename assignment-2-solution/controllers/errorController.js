const path = require('path');
exports.getError = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
}