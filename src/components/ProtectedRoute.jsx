import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  console.log('🔍 ProtectedRoute - Usuario:', user); // ✅ DEBUG
  console.log('🔍 ProtectedRoute - Rol requerido:', requiredRole); // ✅ DEBUG

  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('❌ Rol incorrecto, redirigiendo');
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;