import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

const ProtectedRoute = () => {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
