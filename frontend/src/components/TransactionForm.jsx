import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/transactions';
const getTransactionById = (id) => axios.get(`${API_BASE}/${id}`);
const createTransaction = (data) => axios.post(API_BASE, data);
const updateTransaction = (id, data) => axios.put(`${API_BASE}/${id}`, data);

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
   productID: '',
   productName: '',
   amount: '',
   customerName: '',
   status: 0,
   transactionDate: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (isEdit) {
      getTransactionById(id).then((res) => {
        const tx = res.data;
        setFormData({
          productID: tx.productID,
          productName: tx.productName,
          amount: tx.amount,
          customerName: tx.customerName,
          status: tx.status,
          transactionDate: tx.transactionDate.replace(' ', 'T').slice(0, 16),
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const payload = { ...formData, 
        amount: Number(formData.amount),
        status: Number(formData.status),
        transactionDate: formData.transactionDate.replace('T', ' ') + ':00' };

    if (isEdit) {
      await updateTransaction(id, payload);
    } else {
      await createTransaction(payload);
    }
    navigate('/');
    
  }catch (err) {
      console.error("Backend rejection details:", err.response?.data);
      alert("Bad Request (400): " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Transaction' : 'Add New Transaction'}</h1>
          <Link to="/" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product ID</label>
            <input
              type="text"
              required
              value={formData.productID}
              onChange={(e) => setFormData({ ...formData, productID: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={0}>0 - SUCCESS</option>
                <option value={1}>1 - FAILED</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Transaction Date</label>
            <input
              type="datetime-local"
              required
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link to="/" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</Link>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}