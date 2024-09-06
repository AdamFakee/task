const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/user.controller');
const authMiddleware = require('../../middleware/client/auth.middleware');



router.post("/password/forgot", authMiddleware.requireAuth, controller.forgotPassword);
router.post('/password/otp', authMiddleware.requireAuth, controller.otpPassword);
router.patch('/password/reset', authMiddleware.requireAuth, controller.resetPassword);


module.exports = router;