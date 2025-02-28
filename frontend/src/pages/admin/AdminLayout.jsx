import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkClass = ({ isActive }) => `admin-tab${isActive ? ' active' : ''}`;

  return (
    <div className="container">
      <h1>Admin</h1>
      <nav className="admin-tabs">
        <NavLink to="/admin" className={linkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
