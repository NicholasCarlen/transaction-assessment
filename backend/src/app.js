const express = require('express');
const http = require('http');
const cors = require('cors');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is actively running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err);
});

setInterval(() => {}, 1000 * 60 * 60);