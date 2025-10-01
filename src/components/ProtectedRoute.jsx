import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  console.log('🔍 ProtectedRoute - Usuario:', user);
  console.log('🔍 ProtectedRoute - Rol requerido:', requiredRole);

  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  const userRoleNormalized = user.role?.replace('ROLE_', '') || user.role;
  const requiredRoleNormalized = requiredRole?.replace('ROLE_', '') || requiredRole;

  console.log('🔍 Rol usuario normalizado:', userRoleNormalized);
  console.log('🔍 Rol requerido normalizado:', requiredRoleNormalized);

  if (requiredRole && userRoleNormalized !== requiredRoleNormalized) {
    console.log('❌ Rol incorrecto, redirigiendo');
    const redirectPath = userRoleNormalized === 'ADMIN' ? '/admin' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ Acceso permitido');
  return children;
};

export default ProtectedRoute;