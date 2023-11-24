import { Fragment } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { get } from "./api.js";
import "./index.scss";
import Brand from "./pages/brand/Brand.jsx";
import Donor from "./pages/donor/Donor.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Products from "./pages/products/Products.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Register from "./pages/register/Register.jsx";
import Stock from "./pages/stock/Stock.jsx";

const baseUrl = process.env.REACT_APP_API_URL;

const PrivateRoute = () => {
  const route = useNavigate();
  async function isAuthenticated() {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    get(baseUrl + "/users/find/" + localStorage.getItem("userId")).then((response) => {
      if (response.info?.type === 'Error') throw new Error();
    }).catch(() => { 
      route('/login');
    });
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
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/donor" element={<Donor />} />
          </Route>
          <Route exact path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Fragment>
    </Router>
  );
}
