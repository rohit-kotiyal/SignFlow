import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Check Token is expired or not
const isTokenValid = () => {
    const token = localStorage.getItem("token");

    if(!token) return false;

    try{
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    }catch(e){
        return false;
    }
}


export default function Nav(){

    const navigate = useNavigate();
    const token = isTokenValid();

    // Auto logout if token exists but is expired
    useEffect(() => {
        if(localStorage.getItem("token") && !isTokenValid()){
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="w-full backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-2 md:px-12">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">SignFlow</Link>
                    <div className="space-x-4 font-semibold">   
                        { !token ? (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300">Login</Link>
                                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300">Register</Link>
                            </>
                        ):(
                            <>
                                <Link to="/dashboard" className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300">Dashboard</Link>
                                <button onClick={handleLogout} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 hover:cursor-pointer">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}