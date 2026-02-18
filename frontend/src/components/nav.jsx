import { Link, useNavigate } from "react-router-dom";

export default function Nav(){

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

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
                                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700  transition-colors duration-300">Register</Link>
                            </>
                        ):(
                            <>
                                <button onClick={handleLogout} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700  transition-colors duration-300 hover:cursor-pointer">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}