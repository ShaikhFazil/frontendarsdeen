import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Login from "@/auth/Login";
import Signup from "@/auth/Signup";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { setUser } from "./redux/authSlice";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage but not in Redux yet
    const localStorageToken = localStorage.getItem('token');
    if (localStorageToken && !token) {
      // Wait for Redux to rehydrate
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {


 const dispatch = useDispatch();

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // You might want to verify the token with your backend here
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Don't dispatch setUser here - let redux-persist handle it
  }
}, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
       {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        // {
        //   path: "analytics",
        //   element: <h1 className="title">Analytics</h1>,
        // },
        // {
        //   path: "reports",
        //   element: <h1 className="title">Reports</h1>,
        // },
        // {
        //   path: "customers",
        //   element: <h1 className="title">Customers</h1>,
        // },
        // {
        //   path: "new-customer",
        //   element: <h1 className="title">New Customer</h1>,
        // },
        // {
        //   path: "verified-customers",
        //   element: <h1 className="title">Verified Customers</h1>,
        // },
        // {
        //   path: "products",
        //   element: <h1 className="title">Products</h1>,
        // },
        // {
        //   path: "new-product",
        //   element: <h1 className="title">New Product</h1>,
        // },
        // {
        //   path: "inventory",
        //   element: <h1 className="title">Inventory</h1>,
        // },
        // {
        //   path: "settings",
        //   element: <h1 className="title">Settings</h1>,
        // },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
