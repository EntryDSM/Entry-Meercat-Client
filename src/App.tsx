import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { AuthProvider } from "./contexts/AuthContext"
import { ErrorNotification } from "./components/ErrorNotification"
import { useErrorMonitoring } from "./hooks/useErrorMonitoring"
import "./index.css"

const AppContent = () => {
  const { showErrorPopup, newErrors, closePopup } = useErrorMonitoring();

  return (
    <>
      <RouterProvider router={router}/>
      {showErrorPopup && (
        <ErrorNotification errors={newErrors} onClose={closePopup} />
      )}
    </>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}