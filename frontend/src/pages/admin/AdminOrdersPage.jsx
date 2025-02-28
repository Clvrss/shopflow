import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import Price from '../../components/Price';
import Spinner from '../../components/Spinner';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    adminApi
      .listOrders()
      .then((result) => setOrders(result.data))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const updateStatus = async (order, status) => {
    try {
      await adminApi.updateOrderStatus(order.id, status);
      toast(`Order ${order.orderNumber} → ${status}`, 'success');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!orders) return <Spinner />;

  return (
    <div className="admin-section">
      <h2>Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderNumber}</td>
              <td>
                {o.user ? `${o.user.firstName} ${o.user.lastName}` : `#${o.userId}`}
              </td>
              <td>
                <Price cents={o.totalCents} />
              </td>
              <td>
                <span className={`status status-${o.status}`}>{o.status}</span>
              </td>
              <td>
                <select
                  className="select select-sm"
                  value={o.status}
                  onChange={(e) => updateStatus(o, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
