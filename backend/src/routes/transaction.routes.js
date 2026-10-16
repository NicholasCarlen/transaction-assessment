const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction.controller');

router.get('/', controller.getAllTransactions);
router.get('/:id', controller.getTransactionById);
router.post('/', controller.createTransaction);
router.put('/:id', controller.updateTransaction);

module.exports = router;