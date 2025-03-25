import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './components/admin/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

