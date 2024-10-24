const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/user.controller');
const userMiddleware = require('../../middleware/client/user.middleware');



router.post("/password/forgot", controller.forgotPassword);
router.post('/password/otp', userMiddleware.checkTokenForgotPass, controller.otpPassword);
router.patch('/password/reset', userMiddleware.checkTokenForgotPass, controller.resetPassword);


module.exports = router;