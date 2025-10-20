import { createBrowserRouter } from "react-router-dom";
import { Monitoring, ApiLogs, ApiErrors } from "./pages";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Monitoring/>
  },
  {
    path: '/api-logs',
    element: <ApiLogs/>
  },
  {
    path: '/api-errors',
    element: <ApiErrors/>
  }
])