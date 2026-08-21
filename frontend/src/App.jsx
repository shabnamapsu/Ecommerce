import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// PAGES
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import WishList from "./pages/WishList";

// =====================================================
// ADMIN / OWNER
// =====================================================

import AdminPart from "./component/admin/AdminPart";
import AdminComponent from "./component/admin/AdminComponent";
import ProductList from "./component/admin/ProductList";
import ProductDetails from "./component/admin/ProductDetails";
import Navbaar from "./component/admin/Navbaar";

// =====================================================
// USER
// =====================================================

import UserNav from "./component/UserNav";
import UserComponent from "./component/users/UserComponent";
import UserSlider from "./component/users/UserSlider";

// =====================================================
// SHOPS
// =====================================================

import Shoplist from "./component/shops/Shoplist";
import ShopcreateAdd from "./component/shops/ShopcreateAdd";
import ShopDetails from "./component/shops/ShopDetails";
import Shops from "./component/shops/Shops";


// =====================================================
// GET USER FROM LOCAL STORAGE
// =====================================================

const getUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);

  } catch (error) {
    console.log("User Parse Error:", error);
    return null;
  }
};


// =====================================================
// PROTECTED ROUTE
//
// USER + OWNER BOTH CAN ACCESS
// =====================================================

function ProtectedRoute({ element }) {

  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return element;
}


// =====================================================
// USER ROUTE
//
// ONLY USER ROLE
// =====================================================

function UserRoute({ element }) {

  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "user") {
    return (
      <Navigate
        to="/admincomponent"
        replace
      />
    );
  }

  return element;
}


// =====================================================
// OWNER ROUTE
//
// ONLY OWNER ROLE
// =====================================================

function OwnerRoute({ element }) {

  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "owner") {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return element;
}


// =====================================================
// AUTH ROUTE
//
// LOGIN / FORGOT PASSWORD
// =====================================================

function AuthRoute({ element }) {

  const token = localStorage.getItem("token");
  const user = getUser();

  // Already logged in
  if (token && user) {

    // Owner
    if (user.role === "owner") {
      return (
        <Navigate
          to="/admincomponent"
          replace
        />
      );
    }

    // User
    if (user.role === "user") {
      return (
        <Navigate
          to="/home"
          replace
        />
      );
    }
  }

  return element;
}


// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            SIGNUP
        ================================================= */}

        <Route
          path="/"
          element={
            <Signup />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <AuthRoute
              element={
                <Login />
              }
            />
          }
        />


        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <Route
          path="/forgot-password"
          element={
            <AuthRoute
              element={
                <ForgotPassword />
              }
            />
          }
        />


        {/* =================================================
            HOME
            USER + OWNER
        ================================================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute
              element={
                <Home />
              }
            />
          }
        />


        {/* =================================================
            USER NAVBAR
        ================================================= */}

        <Route
          path="/usernav"
          element={
            <UserRoute
              element={
                <UserNav />
              }
            />
          }
        />


        {/* =================================================
            USER PROFILE
        ================================================= */}

        <Route
          path="/usercomponent"
          element={
            <UserRoute
              element={
                <UserComponent />
              }
            />
          }
        />


        {/* =================================================
            USER SLIDER
        ================================================= */}

        <Route
          path="/user-slider"
          element={
            <UserRoute
              element={
                <UserSlider />
              }
            />
          }
        />


        {/* =================================================
            PRODUCTS
            USER ONLY
        ================================================= */}

        <Route
          path="/products"
          element={
            <UserRoute
              element={
                <Products />
              }
            />
          }
        />


        {/* =================================================
            PRODUCT DETAILS
            USER ONLY
        ================================================= */}

        <Route
          path="/product/:id"
          element={
            <UserRoute
              element={
                <ProductDetails />
              }
            />
          }
        />


        {/* =================================================
            WISHLIST
            USER ONLY
        ================================================= */}

        <Route
          path="/wishlist"
          element={
            <UserRoute
              element={
                <WishList />
              }
            />
          }
        />


        {/* =================================================
            CART
            ⭐ USER + OWNER BOTH
        ================================================= */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute
              element={
                <Cart />
              }
            />
          }
        />


        {/* =================================================
            SUCCESS
            USER ONLY
        ================================================= */}

        <Route
          path="/success"
          element={
            <UserRoute
              element={
                <Success />
              }
            />
          }
        />


        {/* =================================================
            OWNER DASHBOARD
        ================================================= */}

        <Route
          path="/admincomponent"
          element={
            <OwnerRoute
              element={
                <AdminComponent />
              }
            />
          }
        />


        {/* =================================================
            ADMIN PRODUCT PAGE
        ================================================= */}

        <Route
          path="/admin-product"
          element={
            <OwnerRoute
              element={
                <AdminPart />
              }
            />
          }
        />


        {/* =================================================
            ADMIN PRODUCT LIST
        ================================================= */}

        <Route
          path="/admin/products"
          element={
            <OwnerRoute
              element={
                <ProductList />
              }
            />
          }
        />


        {/* =================================================
            ADD PRODUCT
        ================================================= */}

        <Route
          path="/add-product"
          element={
            <OwnerRoute
              element={
                <AddProduct />
              }
            />
          }
        />


        {/* =================================================
            EDIT / UPDATE PRODUCT
            Same AddProduct component
        ================================================= */}

        <Route
          path="/add-product/:id"
          element={
            <OwnerRoute
              element={
                <AddProduct />
              }
            />
          }
        />


        {/* =================================================
            ADMIN NAVBAR
        ================================================= */}

        <Route
          path="/admin-navbar"
          element={
            <OwnerRoute
              element={
                <Navbaar />
              }
            />
          }
        />


        {/* =================================================
            SHOPS LIST
            USER + OWNER BOTH
        ================================================= */}

        <Route
          path="/shops"
          element={
            <ProtectedRoute
              element={
                <Shoplist />
              }
            />
          }
        />


        {/* =================================================
            SHOPS
            USER + OWNER BOTH
        ================================================= */}

        <Route
          path="/shop"
          element={
            <ProtectedRoute
              element={
                <Shops />
              }
            />
          }
        />


        {/* =================================================
            CREATE SHOP
            OWNER ONLY
        ================================================= */}

        <Route
          path="/shop/create"
          element={
            <OwnerRoute
              element={
                <ShopcreateAdd />
              }
            />
          }
        />


        {/* =================================================
            UPDATE SHOP
            OWNER ONLY
        ================================================= */}

        <Route
          path="/shop/update/:id"
          element={
            <OwnerRoute
              element={
                <ShopcreateAdd />
              }
            />
          }
        />


        {/* =================================================
            SHOP DETAILS
            USER + OWNER
        ================================================= */}

        <Route
          path="/shopdetails/:id"
          element={
            <ProtectedRoute
              element={
                <ShopDetails />
              }
            />
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;