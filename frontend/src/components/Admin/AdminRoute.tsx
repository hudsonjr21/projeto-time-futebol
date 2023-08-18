import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  if (!isAuthenticated || user.role !== 'admin') {
    router.push('/');
    return null;
  }

  return children;
};

export default AdminRoute;
