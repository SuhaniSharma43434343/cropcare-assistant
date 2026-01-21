const express = require('express');
const { getDiagnoses, createDiagnosis, updateDiagnosis } = require('../controllers/diagnosisController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getDiagnoses);
router.post('/', createDiagnosis);
router.put('/:id', updateDiagnosis);

module.exports = router;