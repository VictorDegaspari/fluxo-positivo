import { Fragment } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Brand from "./pages/brand/Brand.jsx";
import Donor from "./pages/donor/Donor.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Products from "./pages/products/Products.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Stock from "./pages/stock/Stock.jsx";

import "./index.scss";

const PrivateRoute = () => {
  function isAuthenticated() {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    if (!token || !email) return true; // FIXME mudar aqui quando login estiver OK
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
            <Route path="/products" element={<Products />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/donor" element={<Donor />} />
          </Route>
          <Route exact path="/" element={<Login />} />
        </Routes>
      </Fragment>
    </Router>
  );
}
