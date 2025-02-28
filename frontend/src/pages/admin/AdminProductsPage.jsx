import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import Price from '../../components/Price';
import Spinner from '../../components/Spinner';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => {
    adminApi
      .listProducts()
      .then((result) => setProducts(result.data))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const toggleActive = async (product) => {
    try {
      await adminApi.updateProduct(product.id, { isActive: !product.isActive });
      toast('Product updated', 'success');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!products) return <Spinner />;

  return (
    <div className="admin-section">
      <div className="section-head">
        <h2>Products</h2>
        <button type="button" className="btn btn-primary" onClick={() => setEditing({})}>
          + New product
        </button>
      </div>

      {editing && (
        <ProductForm
          product={editing}
          onDone={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>
                <Price cents={p.priceCents} />
              </td>
              <td>{p.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>
                  Edit
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleActive(p)}>
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductForm({ product, onDone }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    sku: product.sku || '',
    name: product.name || '',
    slug: product.slug || '',
    priceCents: product.priceCents ?? 0,
    description: product.description || '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, priceCents: Number(form.priceCents) };
      if (product.id) await adminApi.updateProduct(product.id, payload);
      else await adminApi.createProduct(payload);
      toast('Saved', 'success');
      onDone();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h3>{product.id ? 'Edit product' : 'New product'}</h3>
      <div className="form-row">
        <label>
          SKU
          <input required value={form.sku} onChange={set('sku')} />
        </label>
        <label>
          Price (cents)
          <input required type="number" min="0" value={form.priceCents} onChange={set('priceCents')} />
        </label>
      </div>
      <label>
        Name
        <input required value={form.name} onChange={set('name')} />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={set('description')} rows={3} />
      </label>
      <div className="form-row">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
