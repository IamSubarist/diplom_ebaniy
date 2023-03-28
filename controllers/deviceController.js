const { Device, DeviceInfo } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../errors/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });
      if (info) {
        info = JSON.parse(info);
        info.map((i) => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    let devices;
    limit = limit || 4
    page = page || 1
    let offset = page * limit - limit
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({limit, offset});
      return res.json(devices);
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
      return res.json(devices);
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
      return res.json(devices);
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset });
      return res.json(devices);
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }
}

module.exports = new DeviceController();
