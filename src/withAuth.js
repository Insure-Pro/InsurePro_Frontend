import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
      // Wait for loading to be false before checking isLoggedIn
      if (!isLoading && !isLoggedIn) {
        navigate("/login");
      }
    }, [isLoggedIn, isLoading, navigate]);

    return <WrappedComponent {...props} />;
  };
};
