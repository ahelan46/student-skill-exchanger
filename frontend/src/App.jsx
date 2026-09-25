import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import Roadmap from './pages/Roadmap';
import FindPartners from './pages/FindPartners';
import MySkills from './pages/MySkills';

const ProtectedRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('demo_username');
  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="matches" element={<Matches />} />
          <Route path="find-partners" element={<FindPartners />} />
          <Route path="requests" element={<Requests />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="skills" element={<MySkills />} />
          <Route path="roadmap" element={<Roadmap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
