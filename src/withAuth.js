import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    console.log("Current isLoggedIn status", isLoggedIn);
    useEffect(() => {
      console.log("isLoggedIn state changed:", isLoggedIn);
      if (!isLoggedIn) {
        navigate("/login");
      }
    }, [isLoggedIn, navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
