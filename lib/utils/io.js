// this isn't a util, should be at same level as app.js
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
