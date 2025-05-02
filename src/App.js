import './App.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateNotePage from "./components/CreateNotePage";
import {UserProvider} from "./components/userContext";
import ProtectedRoute from "./components/protectedRoute";
import UserProfile from "./components/UserProfile";
import ViewNotes from "./components/ViewNotes";
import AboutPage from "./components/About";
import RequestsPage from "./components/RequestsPage";
import FriendsPage from "./components/FriendsPage";
import SharesPage from "./components/SharesPage";

function App() {
  return (
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/create-note"
                element={
                  <ProtectedRoute>
                    <CreateNotePage />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/view-notes"
                element={
                  <ProtectedRoute>
                    <ViewNotes />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/user-requests"
                element={
                  <ProtectedRoute>
                    <RequestsPage />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <FriendsPage />
                  </ProtectedRoute>
                }
            />
            <Route
                path="/shares"
                element={
                  <ProtectedRoute>
                    <SharesPage />
                  </ProtectedRoute>
                }
            />
          </Routes>
        </Router>
      </UserProvider>
  );
}

export default App;
