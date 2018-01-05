const IO = require('socket.io');

let io;
module.exports = {

    init(server) {
        io = new IO(server, { 
            path: '/socket',
            serveClient: false
        });
    },

    get() {
        return io;
    }
};
