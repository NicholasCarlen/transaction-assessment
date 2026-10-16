import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/transactions')
      .then((res) => {
        // Safely handle whether backend returns { data: [...] } or [...] directly
        const rawList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const groupsObj = {};

        rawList.forEach((tx) => {
          const dateStr = String(tx.transactionDate || '2022-07');
          const ym = dateStr.slice(0, 7);
          if (!groupsObj[ym]) groupsObj[ym] = [];
          groupsObj[ym].push(tx);
        });

        const formattedGroups = Object.keys(groupsObj)
          .sort((a, b) => b.localeCompare(a))
          .map((key) => {
            const [y, m] = key.split('-');
            const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            });
            return { key, label, items: groupsObj[key] };
          });

        setGroups(formattedGroups);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-700 font-medium">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Records</h1>
          <p className="text-sm text-gray-500">Grouped by transaction year and month</p>
        </div>
        <Link
          to="/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add Transaction
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md text-sm">
          Backend Connection Error: {error}. Make sure backend is running on port 5000.
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.key} className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">{group.label}</h2>
              <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full">
                {group.items.length} records
              </span>
            </div>

            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 bg-gray-50/50">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Transaction Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {group.items.map((item) => {
                  const isSuccess = Number(item.status) === 0;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">#{item.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{item.productName}</div>
                        <div className="text-xs text-gray-400">ID: {item.productID}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{item.customerName}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        Rp {Number(item.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isSuccess ? 'SUCCESS' : 'FAILED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.transactionDate}</td>
                      <td className="py-3 px-4 text-right space-x-3">
                        <Link to={`/detail/${item.id}`} className="text-blue-600 hover:underline font-medium">View</Link>
                        <Link to={`/edit/${item.id}`} className="text-amber-600 hover:underline font-medium">Edit</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}