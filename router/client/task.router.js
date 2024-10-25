const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/task.controller');
const validate = require('../../validates/client/task.validate');
const { limiter } = require('../../helper/rateLimitTraffic.helper');


router.get('/', controller.index);
router.get('/detail/:id', controller.detail);

// create new row
const message = 'too many click', limitHit = 1, windowMs = 5 * 1000; // 5s
router.post('/create',limiter(windowMs, limitHit, message), validate.checkCreateTask, controller.createPost); // slow network => double click => double row => prevent that case by limit traffic
// End create new row
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', validate.checkEditTask, controller.editPatch);
router.delete('/delete/:id', controller.delete);
router.patch('/change-status', validate.checkCreateTask, controller.changeStatus);
module.exports = router;