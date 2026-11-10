const pemain = require('../models/pemainModel');
const Klub = require('../models/klub');
const { errorHttp } = require('../middlewares/errorHandler');
const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['kodePemain', 'nama', 'rating', 'kategori', 'klubId', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['kodePemain', 'nama', 'rating', 'kategori', 'kontak', 'klubId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  const { kodePemain, nama, rating, kategori, kontak, klubId } = req.body;
  const data = await pemain.create({ kodePemain, nama, rating, kategori, kontak, klubId });
  res.status(201).json(data);
};

exports.getAll = async (req, res) => {
  const filter = {};
  const kodeKlub = req.query.klub;
  if (kodeKlub) {
    const klub = await Klub.findOne({ kodeKlub: String(kodeKlub).toUpperCase() });
    filter.klubId = klub ? klub._id : { $in: [] };
  }
  if (req.query.kategori) {
    filter.kategori = String(req.query.kategori).trim();
  }
  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  // Sorting: ?sort=kodePemain (naik) atau ?sort=-kodePemain (turun). Bawaan: terbaru dulu
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  // Projection: ?fields=kodePemain,nama,kategori
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  const query = pemain.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!select || select.split(' ').includes('klubId')) {
    query.populate('klubId', 'kode nama');
  }

  const [data, total] = await Promise.all([query, pemain.countDocuments(filter)]);

  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};
exports.getById = async (req, res) => {
  const data = await pemain.findById(req.params.id).populate('klubId', 'kode nama');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const fieldYangDiizinkan = ['kodePemain', 'nama', 'rating', 'kategori', 'kontak', 'klubId'];
  const perubahan = Object.fromEntries(
    Object.entries(req.body).filter(([field]) => fieldYangDiizinkan.includes(field))
  );
  const data = await pemain.findByIdAndUpdate(
    req.params.id,
    perubahan,
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await pemain.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};