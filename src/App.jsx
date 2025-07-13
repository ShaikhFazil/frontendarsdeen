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
import axios from "@/utils/axiosConfig";
import Task from "./components/Task";
import AdminRoute from "./utils/AdminRoute";
import EmployeeRoute from "./utils/EmployeeRoute";
import EmployeeTask from "./components/EmployeeTask";
import RoleBasedAccess from "./pages/RoleBasedAccess";
import AdminAssign from "./components/AdminAssign";
import EmployeeLeave from "./components/EmployeeLeave";

// const PrivateRoute = ({ children }) => {
//   const { user, token } = useSelector((state) => state.auth);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check if we have a token in localStorage but not in Redux yet
//     const localStorageToken = localStorage.getItem('token');
//     if (localStorageToken && !token) {
//       // Wait for Redux to rehydrate
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 500);
//       return () => clearTimeout(timer);
//     } else {
//       setIsLoading(false);
//     }
//   }, [token]);

//   if (isLoading) {
//     return <div>Loading...</div>; // Or a proper loading spinner
//   }

//   return user ? children : <Navigate to="/login" replace />;
// };

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Set up response interceptor for this component
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 || error.response?.status === 500) {
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            },
        );

        return () => {
            // Clean up interceptor
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // You might want to verify the token with your backend here
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
                {
                    path: "task",
                    element: (
                        <AdminRoute>
                            <Task />
                        </AdminRoute>
                    ),
                },
                {
                    path: "employeetask",
                    element: (
                        <EmployeeRoute>
                            <EmployeeTask />
                        </EmployeeRoute>
                    ),
                },
                {
                    path: "rolebased",
                    element: (
                        <EmployeeRoute>
                            <RoleBasedAccess />
                        </EmployeeRoute>
                    ),
                },
                {
                    path: "adminassign",
                    element: (
                        <EmployeeRoute>
                            <AdminAssign />
                        </EmployeeRoute>
                    ),
                },
                {
                    path: "leave",
                    element: (
                        // <AdminRoute>
                            <EmployeeLeave />
                        // </AdminRoute>
                    ),
                },
            ],
        },
    ]);

    return (
        <ThemeProvider
            defaultTheme="light"
            storageKey="vite-ui-theme"
        >
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
