import logo from "./logo.svg";
import "./App.css";
// import Main from "./pages/Main";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import Detail from "./pages/Detail";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";
// import Spinner from './components/Spinner';
import "bootstrap/dist/css/bootstrap.min.css";

const Login = lazy(() => import("./pages/Login"));
const Email = lazy(() => import("./pages/Email"));
const Password = lazy(() => import("./pages/Password"));
const Signup = lazy(() => import("./pages/Signup"));
const Main = lazy(() => import("./pages/Main"));
const Detail = lazy(() => import("./pages/Detail"));

function App() {
  return (
    <Suspense>
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email" element={<Email />} />
            <Route path="/password" element={<Password />} />
            <Route path="/main" element={<Main />} />
            <Route path="/detail" element={<Detail />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
