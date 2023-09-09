import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader
      onClick={() => {
        navigate("/");
      }}
    >
      <h2>Insure Pro</h2>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  width: 300px;
  margin: 30px auto;
`;

export default Header;
