const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const initParam = require('../helpers/init');

const MONGODB_URI = initParam.MONGODB_URI;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

exports.sessionMiddleware = session({
    secret: initParam.SECRETE_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 2 // 2 days 
    }
});

exports.initMongoose = (cb) => {
    mongoose.connect(MONGODB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(
        result => {
            cb();
        }    
    ).catch(err => {
        console.log(err);
      });
};