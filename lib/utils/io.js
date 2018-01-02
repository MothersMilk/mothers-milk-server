const Io = require('socket.io');

let io;
module.exports = {

    init(server) {
        io = new Io(server, { 
            path: '/socket',
            serveClient: false
        });
    },

    get() {
        return io;
    }
};
