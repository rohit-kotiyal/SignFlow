import {BrowserRouter, Routes, Route}  from "react-router-dom"
import Nav from "./components/nav";
import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App(){
  return (

    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* The Nav stays outside Routes so it shows up on EVERY page */}
        <Nav />

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}