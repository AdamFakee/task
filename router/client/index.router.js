const taskRouter = require('./task.router');
const userRouter = require('./user.router');
module.exports = (app) => {
    app.use('/task', taskRouter);
    app.use('/user', userRouter);
}