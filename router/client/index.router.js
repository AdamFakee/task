const taskRouter = require('./task.router');
const userRouter = require('./user.router');
const { limiter } = require('../../helper/rateLimitTraffic.helper');


// configure in rateLimit
const message = 'too many click', limitHit = 1, windowMs = 10 * 1000; // 10s
// End configure in rateLimit

module.exports = (app) => {
    app.use('/task', taskRouter);
    app.use('/user', limiter(windowMs, limitHit, message), userRouter);
}