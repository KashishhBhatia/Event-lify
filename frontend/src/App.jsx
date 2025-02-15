// src/App.jsx
import { Route, Routes } from "react-router-dom";
import './index.css';
import Home from './pages/Home';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EventDetails from "./pages/EventDetail";
import LiveEvent from "./pages/LiveEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import EditEvent from "./pages/EditEvent";
import { useAuth } from './context/AuthProvider';

function App() {
  const { authUser, isLoading } = useAuth();
  return (
    <main className="min-h-screen mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/:id/live"
          element={
            <ProtectedRoute>
              <LiveEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
       <Route path="/signup" element={!authUser ? <Signup /> : <Home />} />
        <Route path="/signup" element={!authUser ? <Login /> : <Home />} />
      </Routes>
    </main>
  );
}

export default App;
