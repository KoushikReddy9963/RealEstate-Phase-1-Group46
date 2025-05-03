import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import BuyerPage from './components/BuyerPage';
import SellerPage from './components/SellerPage';
import EmployeePage from './components/EmployeePage';
import AdminPage from './components/AdminPage';
import AdvertisementPage from './components/AdvertisementPage';
import PurchasedPropertiesPage from './components/PurchasedPropertiesPage';
import authService from './services/AuthService';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated(); 
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/advertise" element={<AdvertisementPage />} />

        <Route
          path="/buyer"
          element={
            <PrivateRoute>
              <BuyerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller"
          element={
            <PrivateRoute>
              <SellerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <EmployeePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/purchased-properties"
          element={
            <PrivateRoute>
              <PurchasedPropertiesPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;