import { createBrowserRouter } from "react-router-dom";
import { Monitoring, ApiLogs, ApiErrors, Login } from "./pages";
import { ProtectedRoute } from "./components";

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/',
    element: <ProtectedRoute><Monitoring/></ProtectedRoute>
  },
  {
    path: '/api-logs',
    element: <ProtectedRoute><ApiLogs/></ProtectedRoute>
  },
  {
    path: '/api-errors',
    element: <ProtectedRoute><ApiErrors/></ProtectedRoute>
  }
])