import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionDetail from './components/TransactionDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<TransactionForm />} />
        <Route path="/edit/:id" element={<TransactionForm />} />
        <Route path="/detail/:id" element={<TransactionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}