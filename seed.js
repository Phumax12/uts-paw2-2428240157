// Mengisi database dengan kategori dan 25 contoh usaha.
// Aman dijalankan berulang: data pada collection terkait dihapus terlebih dahulu.
require('dotenv').config({ quiet: true });

const mongoose = require('mongoose');
const pemain = require('./models/pemainModel');
const Category = require('./models/categoriesModel');

const KLUB = [
  'sriwijaya',
  'persib',
];

const KATEGORI = [
  { kodeKategori: 'JUNIOR', namaKategori: 'junior' },
  { kodeKategori: 'SENIOR', namaKategori: 'senior' },
];

const NAMA = [
  { nama: 'Joel purba', rating: '10' },
  { nama: 'Ilham abay', rating: '30' },
  { nama: 'yudi bronc', rating: '40' },
];

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI belum diatur pada file .env');
  }

  try {
    await mongoose.connect(mongoUri);
    await Promise.all([pemain.deleteMany({}), Category.deleteMany({})]);

    const categories = await Category.insertMany(KATEGORI);
    const pemain = KLUB.map((klub, index) => ({
      klub,
      kodepemain: `BIZ-${String(index + 1).padStart(4, '0')}`,
      nama: NAMA[index % NAMA.length],
      categoriesId: categories[index % categories.length]._id,
    }));
    await pemain.insertMany(pemain);

    console.log(`Seed selesai: ${categories.length} kategori, ${pemain.length} usaha`);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main().catch((err) => {
  console.error(`Seed gagal: ${err.message}`);
  process.exitCode = 1;
});