import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../helpers/demoAuth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
