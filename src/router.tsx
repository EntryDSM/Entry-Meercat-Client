import { createBrowserRouter } from "react-router-dom";
import { Monitoring } from "./pages";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Monitoring/>
  }
])