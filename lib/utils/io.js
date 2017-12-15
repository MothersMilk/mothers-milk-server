const Io = require('socket.io');

let io;
module.exports = {
    init(server) {
        io = new Io(server, { 
            path: '/socket',
            serveClient: false
        });

        io.on('connect', function open(client) {
            client.emit('hello','client connected');
        });

        
    },

    get() {
        return io;
    }
    
};
