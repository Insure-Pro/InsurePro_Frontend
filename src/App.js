import logo from "./logo.svg";
import "./App.css";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
