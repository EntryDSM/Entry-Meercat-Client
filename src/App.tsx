import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { AuthProvider } from "./contexts/AuthContext"
import "./index.css"

export const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}