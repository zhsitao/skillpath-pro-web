import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import EmailConfirmation from './components/EmailConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/profile-setup" element={<h2>Profile Setup Page</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
