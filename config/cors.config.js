const CORS = require('cors');

// if to send by subDomain, should use domain like : http://localhost/*.vn 
const whitelist = [];
const options = {
    // check domain in whiteList
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    // enum method to access
    method : ['GET', 'PATCH', 'POST', 'DELETE'],
    // have to send with token
    allowedHeaders : ['Content-Type', 'Authorization'],
    // allow send with cookies + infomation credential with req
    credentials : true,

}

CORS(options);

module.exports.cors = CORS;