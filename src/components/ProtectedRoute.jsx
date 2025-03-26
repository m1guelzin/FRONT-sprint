import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children,mensagem}) => {
    const isAuthenticated = localStorage.getItem("authenticated")
    return isAuthenticated ? children : <Navigate to="/"/> ;
}

export default ProtectedRoute;