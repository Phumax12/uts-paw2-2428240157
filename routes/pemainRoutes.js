const express = require('express');
const router = express.Router();
const pemainController = require('../controllers/pemainController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', pemainController.getAll);
router.get('/:id', pemainController.getById);
router.post('/', cekApiKey, pemainController.create);
router.put('/:id', cekApiKey, pemainController.update);
router.delete('/:id', cekApiKey, pemainController.remove);

module.exports = router;