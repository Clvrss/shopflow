import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import Price from '../components/Price';
import Spinner from '../components/Spinner';

const STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersApi
      .list()
      .then((result) => setOrders(result.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!orders) return <Spinner />;

  return (
    <div className="container">
      <h1>Your orders</h1>
      {!orders.length ? (
        <div className="card">
          <p className="muted">You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link to={`/orders/${o.id}`}>{o.orderNumber}</Link>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status status-${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
                </td>
                <td>
                  <Price cents={o.totalCents} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
