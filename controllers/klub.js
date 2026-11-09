const Klub = require('../models/klub');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res) => {
  const klub = await Klub.create(req.body);
  res.status(201).json(klub);
};

exports.getAll = async (req, res) => {
  res.json(await Klub.find().sort({ namaKlub: 1 }));
};

exports.getById = async (req, res) => {
  const klub = await Klub.findById(req.params.id);
  if (!klub) throw errorHttp(404, 'Klub tidak ditemukan');
  res.json(klub);
};

exports.update = async (req, res) => {
  const klub = await Klub.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!klub) throw errorHttp(404, 'Klub tidak ditemukan');
  res.json(klub);
};

exports.remove = async (req, res) => {
  const klub = await Klub.findByIdAndDelete(req.params.id);
  if (!klub) throw errorHttp(404, 'Klub tidak ditemukan');
  res.status(204).send();
};