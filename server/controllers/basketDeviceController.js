const { ApiError } = require('../error/ApiError');
const { BasketDevice } = require('../models/models');

class BasketDeviceController {
    async create(req,res, next) {
        try {
            const {deviceId, basketId} = req.body;
            const basketDevice = await BasketDevice.create({deviceId, basketId});
            return res.json(basketDevice)
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
};

module.exports = new BasketDeviceController();
