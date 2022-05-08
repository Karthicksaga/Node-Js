const http = require('http');

const port = process.env.port || 3000;

const app = require('./app');
//create a server
const server = http.createServer(app);

//listen on port
server.listen(port);
