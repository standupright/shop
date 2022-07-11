const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const { ApiError } = require('../error/ApiError');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class DeviceController {
    async create(req, res, next) {
        console.log(req.body);
        try {
            const { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            const fileName = img.name;
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({ name, price, brandId, typeId, img: fileName });

            if (info && device) {
                info = JSON.parse(info);
                info.forEach(element => {
                    DeviceInfo.create({
                        title: element.title,
                        description: element.description,
                        deviceId: device.id,
                    })
                });
            }

            return res.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const { brandId, typeId } = req.query;
            let {limit, page} = req.query;

            page = page || DEFAULT_PAGE;
            limit = limit || DEFAULT_LIMIT;
            const offset = page * limit - limit;

            let devices;

            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({ limit, offset });
            }
            if (brandId && !typeId) {
                devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
            }
            if (!brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
            }
            if (brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
            }

            return res.json(devices);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params;
        const device = await Device.findOne({
            where: {id},
            include: [{model: DeviceInfo, as: 'info'}]
        })
        return res.json(device);
    }
};

module.exports = new DeviceController();
