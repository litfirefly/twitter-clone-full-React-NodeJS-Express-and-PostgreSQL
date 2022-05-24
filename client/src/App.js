import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useMutation } from 'react-query';
import PropTypes from 'prop-types';
import axios from 'axios';

import { useAuth } from './contexts/auth-context';

import { STATUS } from './utils/utils';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SignupSuccess from './pages/SignupSuccess';
import UserProfile from './pages/UserProfile';
import Follow from './pages/Follow';
import NoMatch from './pages/NoMatch';

import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import ComposePost from './components/Posts/ComposePost';
import UserPosts from './components/Posts/UserPosts';
import PostsAndReplies from './components/Posts/PostsAndReplies';
import LikedPosts from './components/Posts/LikedPosts';
import FolloweesList from './components/FolloweesList';
import FollowersList from './components/FollowersList';

const App = () => {
  const { login, isAuthenticated, expiresAt, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const verifyToken = useMutation(
    () => {
      return axios.post(
        '/api/auth/verify-token',
        {},
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: (response) => {
        // eslint-disable-next-line no-shadow
        const { user, accessToken: token, expiresAt } = response.data;
        if (response.status === 204) {
          logout();
        } else {
          login(user, token, expiresAt);
        }
      },
      onError: () => {
        logout();
      },
    }
  );

  useEffect(() => {
    verifyToken.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    login,
    // exclude mutations - linter prevents listing only mutation function
  ]);

  useEffect(() => {
    let verifyTokenTimer;
    if (isAuthenticated) {
      verifyTokenTimer = setTimeout(() => {
        verifyToken.mutate();
      }, new Date(expiresAt).getTime() - Date.now() - 10 * 1000);
    }
    return () => {
      if (isAuthenticated && verifyTokenTimer) {
        clearTimeout(verifyTokenTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    expiresAt,
    // exclude mutations - linter prevents listing only mutation function
  ]);

  return (
    <div>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <RequireAuth redirectTo="/signup">
                <Navigate to="home" />
              </RequireAuth>
            }
          />
          <Route
            path="home"
            element={
              <RequireAuth redirectTo="/signup">
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/:username" element={<UserProfile />}>
            <Route index element={<UserPosts />} />
            <Route path="posts" element={<UserPosts />} />
            <Route path="with_replies" element={<PostsAndReplies />} />
            <Route path="likes" element={<LikedPosts />} />
          </Route>
          <Route path="/:username/list" element={<Follow />}>
            <Route path="followers" element={<FollowersList />} />
            <Route path="following" element={<FolloweesList />} />
          </Route>
          <Route
            path="compose/post"
            element={
              <RequireAuth redirectTo="/signup">
                <Navigate
                  to="/home"
                  state={{
                    from: location,
                  }}
                />
              </RequireAuth>
            }
          />
        </Route>
        <Route
          path="/signup"
          element={
            <RedirectIfLoggedIn redirectTo="/">
              <Signup />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectIfLoggedIn redirectTo="/">
              <Signin />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/signup/success"
          element={
            <RequireAuth redirectTo="/signup">
              <SignupSuccess />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/compose/post"
            element={
              <RequireAuth redirectTo="/signup">
                <Modal
                  isOpen
                  onDismiss={() =>
                    navigate('/home', {
                      replace: true,
                    })
                  }
                  title="Add new post"
                >
                  <ComposePost />
                </Modal>
              </RequireAuth>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const RequireAuth = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} />
  );
};

const RedirectIfLoggedIn = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    <Navigate to={location.state?.from?.pathname || redirectTo} />
  ) : (
    children
  );
};

RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

RedirectIfLoggedIn.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default App;
