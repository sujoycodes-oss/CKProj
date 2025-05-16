import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useSelector(state => state.auth);

  if (!user) return <Navigate to='/' replace />;
  
  if (requiredRole && user?.role !== requiredRole) return <Navigate to='/' replace />;

  return children;
};

export default ProtectedRoute;
