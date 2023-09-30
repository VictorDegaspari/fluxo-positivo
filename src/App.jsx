import { Fragment } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Home from "./pages/home/Home.jsx";

import "./index.scss";

const PrivateRoute = () => {
  function isAuthenticated() {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    if (!token || !email) return true;
    return true;
  }

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route exact path="/login" element={<div> </div>} />
        </Routes>
      </Fragment>
    </Router>
  );
}
