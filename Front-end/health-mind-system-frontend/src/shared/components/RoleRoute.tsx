import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";

interface RoleRouteProps {
    allow: string[];
}

export default function RoleRoute({ allow }: RoleRouteProps) {
    const { role } = usePermissions();

    if (!allow.includes(role)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
