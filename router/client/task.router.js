const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/task.controller');
const validate = require('../../validates/client/task.validate');


router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.post('/create', validate.checkCreateTask, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', validate.checkEditTask, controller.editPatch);
router.delete('/delete/:id', controller.delete);
router.patch('/change-status', validate.checkCreateTask, controller.changeStatus);
module.exports = router;