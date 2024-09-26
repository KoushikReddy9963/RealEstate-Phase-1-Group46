import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import BuyerPage from './components/BuyerPage';
import EmployeePage from './components/EmployeePage';
import SellerPage from './components/SellerPage';
import SignupPage from './components/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import AccessDenied from './components/AccessDenied';
import Advertisement from './components/AdvertisementPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin" element={<PrivateRoute component={AdminPage} role="admin" />} />
      <Route path="/buyer" element={<PrivateRoute component={BuyerPage} role="buyer" />} />
      <Route path="/employee" element={<PrivateRoute component={EmployeePage} role="employee" />} />
      <Route path="/seller" element={<PrivateRoute component={SellerPage} role="seller" />} />
      <Route path="/Advertise" element={<Advertisement />} />
      <Route path="/access-denied" element={<AccessDenied />} />
    </Routes>
  );
}

export default App;
