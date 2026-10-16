const express = require("express");
const router = express.Router();
const controller = require('../contollers/transaction.controller');

router.get('/',controller.getAllTransactions);
router.get('/:id', controller.getTransactionsById);
router.post('/', controller.createTransaction);
router.put('/:id', controller.updateTransaction);

module.exports = router;