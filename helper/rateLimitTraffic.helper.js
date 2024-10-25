const rateLimit = require('express-rate-limit');

// initial limit 
const limiter = (windowMs, limitHit, message) => rateLimit({
	windowMs: windowMs, 
	limit: limitHit, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message : message,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            code : options.statusCode,
            message : options.message,
        });
        return;
    }
})

module.exports.limiter = limiter;