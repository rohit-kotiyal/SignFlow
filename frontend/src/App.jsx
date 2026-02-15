import {BrowserRouter, Routes, Route}  from "react-router-dom"
import Nav from "./components/nav";
import Home from "./pages/Home"


export default function App(){
  return (

    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* The Nav stays outside Routes so it shows up on EVERY page */}
        <Nav />

        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}