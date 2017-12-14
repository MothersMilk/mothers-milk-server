const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/connect');
const wss = require('./lib/utils/websocket');


const adminToken = require('./test/e2e/adminToken');

connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mothersmilk');

const server = http.createServer(app);

wss.init(server);

const port = process.env.PORT || 3001;


adminToken();

server.listen(port, () => {
    console.log('server running on', server.address().port);
});