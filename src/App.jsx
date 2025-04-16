import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmailConfirmation from './components/EmailConfirmation';
import Learning from './pages/Learning';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <Router>
        <Routes>
          <Route path="/" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <HomePage />
          } />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/confirm" element={<EmailConfirmation />} />
          <Route path="/learning" element={
            localStorage.getItem('token') ? <Learning /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
