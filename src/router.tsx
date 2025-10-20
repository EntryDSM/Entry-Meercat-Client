import { createBrowserRouter } from "react-router-dom";
import { Monitoring, ApiLogs } from "./pages";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Monitoring/>
  },
  {
    path: '/api-logs',
    element: <ApiLogs/>
  }
])