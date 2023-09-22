import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const CustomerDetail = ({ info }) => {
  console.log(CustomerDetail);

  const navigate = useNavigate();
  //   console.log({ customer });
  return (
    <div className="customer-detail-container">
      <div className="backpage">
        <span className="navigation" onClick={() => navigate(-1)}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ marginRight: "16px" }}
          />
          이전 화면으로 돌아가기
        </span>
      </div>
      <div className="customer_tnp">
        <Button
          style={{
            display: "flex",
            width: "34px",
            height: "24px",
            padding: "4.84px 8.067px",
            justifyContent: "center",
            alignItems: "center",
            gap: "6.454px",
            fontWeight: "bold",
            borderBlockWidth: "2px",
            borderRightWidth: "2px",
            borderLeftWidth: "2px",
          }}
          variant="success"
        >
          {info.customerTypeString}
        </Button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 className="customerName">{info.name}</h2>
          <h2>
            <Form.Check
              aria-label="option 1"
              checked={info.contractYn}
              readOnly
              style={{ paddingTop: "8px", marginLeft: "12px" }}
            />
          </h2>
        </div>

        {/* <img src="edit.png" alt="Edit Icon" className="editIcon" /> */}
        <p className="customerPhone">{info.phone}</p>
      </div>
    </div>
  );
};
export default CustomerDetail;
