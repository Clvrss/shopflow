import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState('');

  const saveProfile = (e) => {
    e.preventDefault();
    toast('Profile updated', 'success');
  };

  return (
    <div className="container container-narrow">
      <h1>My account</h1>
      <div className="card">
        <h2>Profile</h2>
        <form className="form" onSubmit={saveProfile}>
          <div className="summary-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="summary-row">
            <span>Role</span>
            <span>{user?.role}</span>
          </div>
          <label>
            Bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </label>
          <button type="submit" className="btn btn-primary">
            Save profile
          </button>
        </form>
      </div>
    </div>
  );
}
