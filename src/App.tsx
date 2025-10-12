import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Topbar from './components/Topbar';
import { AuthProvider } from './contexts/AuthContext';

const App = () => (
  <Router>
    <AuthProvider>
      <Topbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </AuthProvider>
  </Router>
);

export default App;
