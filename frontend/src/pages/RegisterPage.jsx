import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container container-narrow">
      <div className="card">
        <h1>Create your account</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>
              First name
              <input required value={form.firstName} onChange={set('firstName')} />
            </label>
            <label>
              Last name
              <input required value={form.lastName} onChange={set('lastName')} />
            </label>
          </div>
          <label>
            Email
            <input type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
