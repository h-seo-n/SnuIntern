import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreateProfile from './components/CreateProfile';
import Home from './components/Home';
import Login from './components/Login';
import MyPage from './components/MyPage';
import Signup from './components/Signup';
import Topbar from './components/Topbar';

import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { ProfileContextProvider } from './contexts/ProfileContext';

const App = () => (
  <Router>
    <AuthProvider>
      <PostProvider>
        <ProfileContextProvider>
          <Topbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/profile/new" element={<CreateProfile />} />
            </Routes>
          </main>
        </ProfileContextProvider>
      </PostProvider>
    </AuthProvider>
  </Router>
);

export default App;
