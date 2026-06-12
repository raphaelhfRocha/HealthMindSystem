import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Guarda a rota tentada para retornar o usuário a ela após o login.
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
