import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelectionPage from './page/RoleSelectionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>SkillPath Pro</h1>

        <Routes>
          <Route path="/" element={<RoleSelectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
