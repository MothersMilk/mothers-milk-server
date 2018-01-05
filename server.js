const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/connect');
const io = require('./lib/io');


connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mothersmilk');

const server = http.createServer(app);

io.init(server);

const port = process.env.PORT || 3001;


server.listen(port, () => {
    console.log('server running on', server.address().port);
});