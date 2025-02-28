import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Price from '../../components/Price';
import Spinner from '../../components/Spinner';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.dashboardStats(), adminApi.lowStock().catch(() => [])])
      .then(([s, l]) => {
        setStats(s);
        setLowStock(l);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Revenue', value: <Price cents={stats.revenueTotalCents} /> },
    { label: 'Orders', value: stats.ordersTotal },
    { label: 'Customers', value: stats.uniqueCustomers },
    { label: 'Pending orders', value: stats.pendingOrders },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card card" key={c.label}>
            <span className="stat-label">{c.label}</span>
            <span className="stat-value">{c.value}</span>
          </div>
        ))}
      </div>

      <h2>Low stock alerts</h2>
      {!lowStock.length ? (
        <p className="muted">All products are sufficiently stocked.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item) => (
              <tr key={item.productId}>
                <td>{item.product?.name || item.productName || `#${item.productId}`}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
