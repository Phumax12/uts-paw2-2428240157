const mongoose = require('mongoose');

const klubSchema = new mongoose.Schema({
  kodeKlub: { type: String, required: [true, 'kode klub wajib diisi'], unique: true, trim: true, uppercase: true },
  namaKlub: { type: String, required: [true, 'nama klub wajib diisi'], trim: true },
});

module.exports = mongoose.model('Klub', klubSchema);