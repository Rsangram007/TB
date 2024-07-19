import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ permittedRoles, children }) {
    const { user } = useAuth();
    if (!user && localStorage.getItem('token')) {
        return <p>Loading...</p>;
    }
    if(!user){
        return <Navigate to='/login'/>
    }
    if (!permittedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" />;
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
   
    return children;
}

