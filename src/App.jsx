import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Login from "@/auth/Login";
import Signup from "@/auth/Signup";
import NotFound from "./pages/NotFound";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
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
