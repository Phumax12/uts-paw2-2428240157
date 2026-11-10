const express = require('express');
const router = express.Router();
const klub = require('../controllers/klub');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', klub.getAll);
router.get('/:id', klub.getById);
router.post('/', cekApiKey, klub.create);
router.put('/:id', cekApiKey, klub.update);
router.delete('/:id', cekApiKey, klub.remove);

module.exports = router;