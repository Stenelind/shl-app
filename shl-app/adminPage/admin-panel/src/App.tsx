import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./components/admin/AdminPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<h1>Sidan hittades inte</h1>} /> {/* 404-sida */}
      </Routes>
    </Router>
  );
};

export default App;
