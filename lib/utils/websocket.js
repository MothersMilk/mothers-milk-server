/// new socket code //
const Io = require('socket.io');
//what to put as port/url? 3001 clashes with server port
let wss;
module.exports = {
    init(server) {
        wss = new Io(server, { 
            path: '/socket',
            serveClient: false
        });

        wss.on('connect', function open(client) {
            client.emit('hello','client connected');
        });

        
    },
    
    get() {
        return wss;
    }
    
};
