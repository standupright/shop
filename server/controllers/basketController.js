const { ApiError } = require('../error/ApiError');
const { Basket, BasketDevice, Device } = require('../models/models');


class BasketController {
    async getDevicesInBasket(req, res, next) {
        try {
            const { id } = req.params;
            const basket = await Basket.findOne({ where: { userId: id } });

            if (!basket) {
                next(ApiError.badRequest('Basket with this user id not found'));
            }
            const basketDevices = await BasketDevice.findAll({ where: { basketId: basket.id } });
            const IdsBasketDevices = basketDevices.map((el) => el.deviceId);
            const devices = await Device.findAll({
                where: {
                    id: IdsBasketDevices,
                }
            });

            if (devices) {
                return res.json(devices);
            }
            return res.json(null);

        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
};

module.exports = new BasketController();
