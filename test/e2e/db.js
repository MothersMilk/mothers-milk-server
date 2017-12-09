const connect = require( '../../lib/connect');
const mongoose = require( 'mongoose');
const url = 'mongodb://localhost:27017/mothersmilk';

before(()=> connect(url));
after(()=> mongoose.connection.close());

