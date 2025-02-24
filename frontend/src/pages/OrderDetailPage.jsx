import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import Price from '../components/Price';
import Spinner from '../components/Spinner';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersApi
      .get(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!order) return <Spinner />;

  return (
    <div className="container container-narrow">
      <nav className="breadcrumbs">
        <Link to="/orders">Orders</Link>
        <span>/</span>
        <span>{order.orderNumber}</span>
      </nav>
      <h1>Order {order.orderNumber}</h1>

      <div className="card">
        <div className="summary-row">
          <span>Status</span>
          <span className={`status status-${order.status}`}>{order.status}</span>
        </div>
        <div className="summary-row">
          <span>Payment</span>
          <span>{order.paymentStatus}</span>
        </div>
        <div className="summary-row">
          <span>Placed</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="card">
        <h2>Items</h2>
        {order.items?.map((item) => (
          <div className="cart-line" key={item.id}>
            <div className="cart-line-info">
              <strong>{item.productName}</strong>
              <span className="muted">SKU: {item.sku}</span>
            </div>
            <span>× {item.quantity}</span>
            <Price cents={item.totalCents} />
          </div>
        ))}
      </div>

      <div className="card">
        <div className="summary-row">
          <span>Subtotal</span>
          <Price cents={order.subtotalCents} />
        </div>
        {order.discountCents > 0 && (
          <div className="summary-row">
            <span>Discount</span>
            <span className="discount">−<Price cents={order.discountCents} /></span>
          </div>
        )}
        <div className="summary-row">
          <span>Shipping</span>
          <Price cents={order.shippingCents} />
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <Price cents={order.taxCents} />
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <Price cents={order.totalCents} />
        </div>
      </div>
    </div>
  );
}
