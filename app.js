require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const klubRoutes = require('./routes/klub');
const pemainRoutes = require('./routes/pemainRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});

// ---------- Route per modul ----------
app.use('/pemain', pemainRoutes);
app.use('/klub', klubRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);


async function startServer() {
  const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI belum diatur; server memerlukan koneksi MongoDB');
  }

  await mongoose.connect(mongoUri);
  console.log('Terhubung ke MongoDB');
  return app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error(`Gagal menjalankan server: ${err.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };