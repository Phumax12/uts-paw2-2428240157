const mongoose = require('mongoose');

const kontakSchema = new mongoose.Schema({
  telepon: String,
  email: String,
}, { _id: false });

const pemainSchema = new mongoose.Schema({
  kodePemain: { type: String, required: [true, 'kodePemain wajib diisi'], unique: true, trim: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  rating: { type: Number, required: [true, 'rating wajib diisi'], min: [0, 'rating minimal 0'] },
  kategori: { type: String, required: [true, 'kategori wajib diisi'], trim: true },
  kontak: { type: kontakSchema, default: undefined },
  klubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Klub', required: [true, 'klubId wajib diisi'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pemain', pemainSchema);