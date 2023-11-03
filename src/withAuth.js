import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!isLoggedIn) {
        navigate("/login");
      }
    }, [isLoggedIn, navigate]);

    return <WrappedComponent {...props} />;
  };
};
