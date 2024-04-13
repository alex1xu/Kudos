import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import { Navbar } from "./components/Navbar.js";
import Community from "./pages/Community";
import ViewListing from "./pages/ViewListing";
import Settings from "./pages/Settings";
import Maintenence from "./pages/Maintenence";
import Admin from "./pages/Admin";
import { UserContext } from "./components/UserContext";
import { getCurrentUser } from "./utility.js";

function App() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <>
      {process.env.REACT_APP_MAINTENANCE_MODE == "1" ? (
        <Router>
          <Routes>
            <Route path="*" element={<Maintenence />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <UserContext.Provider value={value}>
            <Navbar />
            <Routes>
              <Route path="/*" element={<Home />} />
              <Route path="/explore/*" element={<Explore />} />
              <Route path="/explore/:type" element={<Explore />} />
              <Route path="/create-listing/:type" element={<CreateListing />} />
              <Route path="/edit-listing/:id" element={<EditListing />} />
              <Route path="/listing/:id" element={<ViewListing />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/community" element={<Community />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/dash" element={<Admin />} />
            </Routes>
          </UserContext.Provider>
        </Router>
      )}
    </>
  );
}

export default App;
