import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import App from "./App";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./Layouts/ProtectedRoute"; // Import ProtectedRoute
import PlaceOrder from "./pages/PlaceOrder";
import OrdersHistory from "./pages/OrdersHistory";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorThrowing from "./components/ErrorThrowing";

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <ProtectedRoute>
        <ProductDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/placeOrder",
    element: (
      <ProtectedRoute>
        <PlaceOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/history",
    element: (
      <ProtectedRoute>
        <OrdersHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/errorBoundary",
    element: (
      <ErrorBoundary>
        <ErrorThrowing />
      </ErrorBoundary>
    ),
  },
  {
    path: "*", // Catch-all route for 404 page
    element: <ErrorPage statusCode={404} message="Page Not Found" />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
