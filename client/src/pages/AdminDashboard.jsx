import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user || !user.isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.email}. This is the admin dashboard.</p>
    </div>
  );
}

export default AdminDashboard;