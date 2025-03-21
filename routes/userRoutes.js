const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAuth } = require('../middlewares/authentication');

router.use(verifyAuth());
router.get('/list', userController.getUserList);

module.exports = router;
