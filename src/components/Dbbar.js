import axios from "axios";
import React, { useRef, useState } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import Nav from "react-bootstrap/Nav";

const Dbbar = ({ children }) => {
  return (
    <div>
      <div className="navbar-container">
        <Navbar />
        <div className="content">
          <h1 className="maintitle">전체</h1>
          <Nav className="유형바" variant="underline" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link eventKey="link-1">All</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-2">OD</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-3">AD</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-4">CP</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-5">CD</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-6">JD</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-7">H</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-8">X</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-9">Y</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-9">Z</Nav.Link>
            </Nav.Item>
          </Nav>
          <hr
            style={{ marginTop: "-2px", marginLeft: "24px", height: "15px" }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dbbar;
