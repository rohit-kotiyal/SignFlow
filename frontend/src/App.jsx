import { useEffect, useState } from "react";
import axios from "axios";

export default function App(){

  const [message, setMessage] = useState("");

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/").then(
      res => setMessage(res.data.message)).catch(err => console.error(err));
  },[]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">
        {message}
      </h1>
    </div>
  );
}