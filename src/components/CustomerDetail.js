import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import EditModalD from "../components/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import editIcon from "../external/edit.png";
import "../App.css";

const CustomerDetail = ({ data }) => {
  const navigate = useNavigate();
  // Step 1: Add a state to manage the visibility of the EditModal
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerData, setCustomerData] = useState(data);
  const [selectedCustomer, setSelectedCustomer] = useState(data); // initialCustomerData는 초기 고객 데이터입니다.
  // Step 2: Add an event handler that sets showEditModal to true when the edit icon is clicked
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    // Optionally, refresh customer data if it has been modified in the modal
  };

  return (
    <div className="customer-detail-container">
      <div
        className="backpage"
        style={{ marginTop: "30px", marginBottom: "20px" }}
      >
        <span
          className="navigation"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
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
            // margin: "12px 0px",
            padding: "4.84px 8.067px",
            justifyContent: "center",
            alignItems: "center",
            gap: "6.454px",
            fontWeight: "bold",
            borderBlockWidth: "2px",
            borderRightWidth: "2px",
            borderLeftWidth: "2px",
            // backgroundColor: "#175CD3",
          }}
          variant="success"
        >
          {data.customerTypeString}
        </Button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 className="customerName">{data.name}</h2>
            <h2>
              <Form.Check
                aria-label="option 1"
                checked={data.contractYn}
                readOnly
                style={{ paddingTop: "8px", marginLeft: "12px" }}
              />
            </h2>
          </div>
          <div>
            <img
              className="userName"
              src={editIcon}
              style={{
                paddingTop: "8px",
                marginLeft: "12px",
                cursor: "pointer",
              }}
              onClick={handleEditClick}
            />
            {/* Render the EditModal and pass the show prop and a function to close the modal */}
            <EditModalD
              show={showEditModal}
              onClose={(updatedData) => {
                // 업데이트된 데이터로 상태를 변경합니다.
                setSelectedCustomer(updatedData);
              }}
              onHide={() => setShowEditModal(false)}
              selectedCustomer={data} // Pass the customer data to the EditModal
            />
          </div>
        </div>

        {/* <img src="edit.png" alt="Edit Icon" className="editIcon" /> */}
        <p className="customerPhone">{data.phone}</p>
      </div>
    </div>
  );
};
export default CustomerDetail;
