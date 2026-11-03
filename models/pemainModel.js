const mongoose = require('mongoose');

const namaSchema = new mongoose.Schema({
  nama: String,
  rating: String,
}, { _id: false });

const pemainSchema = new mongoose.Schema({
  klub: { type: String, required: [true, 'klub wajib diisi'], trim: true },
  nama: namaSchema,
  categoriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori' },
  kodepemain: { type: String, required: [true, 'kodepemain wajib diisi'], unique: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pemain', pemainSchema);