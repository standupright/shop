const Router = require('express');
const basketDeviceController = require('../controllers/basketDeviceController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware, basketDeviceController.create);

module.exports = router;
