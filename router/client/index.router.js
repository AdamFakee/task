const taskRouter = require('./task.router');
const userRouter = require('./user.router');
const authMiddleware = require('../../middleware/client/auth.middleware');

module.exports = (app) => {
    app.use('/task', authMiddleware.requireAuth, taskRouter);
    app.use('/user', userRouter);
}