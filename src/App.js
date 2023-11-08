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
import { withAuth } from "./withAuth";

import "bootstrap/dist/css/bootstrap.min.css";

const Login = lazy(() => import("./pages/Login"));
const Email = lazy(() => import("./pages/Email"));
const Password = lazy(() => import("./pages/Password"));
const Signup = lazy(() => import("./pages/Signup"));
const Main = lazy(() => import("./pages/Main"));
const Detail = lazy(() => import("./pages/Detail"));
const Analysis = lazy(() => import("./pages/Analysis"));

const ProtectedMain = withAuth(Main);
const ProtectedDetail = withAuth(Detail);
const ProtectedAnalysis = withAuth(Analysis);

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
            <Route path="/main" element={<ProtectedMain />} />
            <Route path="/detail" element={<ProtectedDetail />} />
            <Route path="/analysis" element={<ProtectedAnalysis />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
