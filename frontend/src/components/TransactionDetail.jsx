import { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/transactions';
const getTransactionById = (id) => axios.get(`${API_BASE}/${id}`);
const createTransaction = (data) => axios.post(API_BASE, data);
const updateTransaction = (id, data) => axios.put(`${API_BASE}/${id}`, data);

export default function TransactionDetail() {
  const { id } = useParams();
  const [tx, setTx] = useState(null);

  useEffect(() => {
    getTransactionById(id).then((res) => setTx(res.data));
  }, [id]);

  if (!tx) return <div className="p-8 text-gray-500">Loading details...</div>;

  const isSuccess = tx.status === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <Link to="/" className="text-xs text-blue-600 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-900 mt-1">Transaction #{tx.id}</h1>
          </div>
          <Link to={`/edit/${tx.id}`} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium">Edit Data</Link>
        </div>
        
    <div className="space-y-4 text-sm divide-y divide-gray-100">
          <div className="flex justify-between pt-2"><span className="text-gray-500">Transaction ID</span><span className="font-medium">{tx.id}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Product ID</span><span className="font-medium">{tx.productID}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Product Name</span><span className="font-medium">{tx.productName}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Customer Name</span><span className="font-medium">{tx.customerName}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Amount</span><span className="font-medium">Rp {Number(tx.amount).toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between pt-4">
            <span className="text-gray-500">Status</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isSuccess ? 'SUCCESS (0)' : 'FAILED (1)'}
            </span>
          </div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Transaction Date</span><span className="font-medium">{tx.transactionDate}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Created By</span><span className="font-medium">{tx.createBy}</span></div>
          <div className="flex justify-between pt-4"><span className="text-gray-500">Created On</span><span className="font-medium">{tx.createOn}</span></div>
        </div>
      </div>
    </div>
  );
}


