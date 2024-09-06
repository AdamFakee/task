const express = require('express');
const router = express.Router();

const controller = require('../../controller/client/task.controller');

router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.post('/create', controller.createPost);
router.patch('/edit/:id', controller.editPatch);
router.delete('/delete/:id', controller.delete);
router.patch('/change-status', controller.changeStatus);
module.exports = router;