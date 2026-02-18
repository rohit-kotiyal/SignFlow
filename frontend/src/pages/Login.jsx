import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";

export default function Login(){

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

        try{
            const res = await loginUser({
                email: email.trim(),
                password: password.trim()
            });
            localStorage.setItem("token", res.data.access_token);  // ✅ save token
            navigate("/dashboard");
        } catch(err){
            if(err.response?.status === 401){
                setError("Invalid email or password");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <main className="flex flex-1 justify-center items-center">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Login To Signflow</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>
                    )}

                    <label htmlFor="email" className="font-semibold">Email</label>
                    <input type="email" id="email" placeholder="Enter Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-indigo-500" required/>

                    <label htmlFor="password" className="font-semibold">Password</label>
                    <input type="password" id="password" placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-indigo-500" required/>

                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 text-center text-lg text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer">
                        Login
                    </button>

                    <div className="flex flex-col justify-center items-center font-semibold">
                        <p className="text-gray-700">Don't Have An Account?</p>
                        <Link to="/register" className="text-indigo-600 hover:underline hover:text-indigo-500 transition-transform duration-300">Register</Link>
                    </div>

                </form>
            </div>
        </main>
    );
}