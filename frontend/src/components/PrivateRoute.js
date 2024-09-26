import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/AuthService';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (userRole !== role) {
    return <Navigate to="/access-denied" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
