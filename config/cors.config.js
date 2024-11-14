const CORS = require('cors');

// list link domain
const whiteList = [];
const options = {
    // check domain in whiteList
    origin: function (origin, callback) {
        if(whiteList.length == 0) {
            return callback(new Error('whiteList in CORS is empty'));
        }
        if (whiteList.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    // enum method to access
    method : ['GET', 'PATCH', 'POST', 'DELETE'],
    // have to send with token
    allowedHeaders : ['Authorization'],
    // allow send with cookies + infomation credential with req
    credentials : true,

}

CORS(options);

module.exports.cors = CORS;