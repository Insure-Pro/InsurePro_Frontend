import logo from "./logo.svg";
import "./App.css";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { refreshToken } from "./redux/authSlice";
import { Provider } from "react-redux";
import store from "./redux/store";
import withAuth from "./withAuth";
import { loginSuccess, logoutSuccess } from "./redux/authSlice";

const Login = lazy(() => import("./pages/Login"));
const Email = lazy(() => import("./pages/Email"));
const Password = lazy(() => import("./pages/Password"));
const Signup = lazy(() => import("./pages/Signup"));
const Main = lazy(() => import("./pages/Main"));
const Detail = lazy(() => import("./pages/Detail"));
// const Map = lazy(() => import("./pages/Map"));
const KakaoMap = lazy(() => import("./pages/KakaoMap"));
const Inquiry = lazy(() => import("./pages/Inquiry"));
const Analysis = lazy(() => import("./pages/Analysis"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const ProtectedMain = withAuth(Main);
const ProtectedDetail = withAuth(Detail);
// const ProtectedMap = withAuth(Map);
const ProtectedKakaoMap = withAuth(KakaoMap);
const ProtectedInquiry = withAuth(Inquiry);
const ProtectedAnalysis = withAuth(Analysis);

function App() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const isLoggedInStorage = localStorage.getItem("isLoggedIn") === "true";
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // console.log("App Loaded. isLoggedIn from storage:", isLoggedInStorage);
    if (isLoggedInStorage && accessToken && refreshToken) {
      dispatch(
        loginSuccess({
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      );
    } else {
      dispatch(logoutSuccess());
    }
  }, [dispatch]);

  // console.log("App Rendered. Current isLoggedIn status:", isLoggedIn);

  return (
    <Suspense>
      <div className="App">
        <div>
          <Routes>
            <Route
              exact
              path="/"
              element={isLoggedIn ? <ProtectedMain /> : <Login />}
            />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email" element={<Email />} />
            <Route path="/password" element={<Password />} />
            <Route path="/landingPage" element={<LandingPage />} />
            <Route path="/main" element={<ProtectedMain />} />
            <Route path="/detail" element={<ProtectedDetail />} />
            <Route path="/map" element={<ProtectedKakaoMap />} />
            <Route path="/inquiry" element={<ProtectedInquiry />} />
            <Route path="/analysis" element={<ProtectedAnalysis />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
