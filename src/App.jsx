import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmailConfirmation from './components/EmailConfirmation';
import Learning from './pages/Learning';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/learning" element={
            <PrivateRoute>
              <Learning />
            </PrivateRoute>
          } />
          <Route path="/confirm" element={<EmailConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
