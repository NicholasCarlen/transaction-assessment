const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatDate = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

async function getAllTransactions(req, res) {
  try {
    const [transactions, statuses] = await Promise.all([
      prisma.transaction.findMany({ orderBy: { transactionDate: 'desc' } }),
      prisma.status.findMany(),
    ]);

    const formattedData = transactions.map((t) => ({
      ...t,
      transactionDate: formatDate(t.transactionDate),
      createOn: formatDate(t.createOn),
    }));

    res.json({ data: formattedData, status: statuses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
}

async function getTransactionById(req, res) {
  try {
    const id = Number(req.params.id);
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      ...transaction,
      transactionDate: formatDate(transaction.transactionDate),
      createOn: formatDate(transaction.createOn),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
  }
}

async function createTransaction(req, res) {
  try {
    const { productID, productName, amount, customerName, status, transactionDate, createBy } = req.body;

    const newTx = await prisma.transaction.create({
      data: {
        productID: String(productID),
        productName,
        amount: String(amount),
        customerName,
        status: Number(status),
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        createBy: createBy || 'admin',
        createOn: new Date(),
      },
    });

    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create transaction', error: err.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const id = Number(req.params.id);
    const { productID, productName, amount, customerName, status, transactionDate, createBy } = req.body;

    const updatedTx = await prisma.transaction.update({
      where: { id },
      data: {
        productID: String(productID),
        productName,
        amount: String(amount),
        customerName,
        status: Number(status),
        transactionDate: transactionDate ? new Date(transactionDate) : undefined,
        createBy,
      },
    });

    res.json(updatedTx);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update transaction', error: err.message });
  }
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
};