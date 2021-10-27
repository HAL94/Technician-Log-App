require('dotenv').config();
const http = require('http');
console.log(process.env.DB_HOST);
const app = require('./app');


const port = process.env.PORT || 3000;
// express application qualifies as a request handler
const server = http.createServer(app);

server.listen(port);
console.log('connected on port: ' + port);
