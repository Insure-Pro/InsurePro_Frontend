import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import EditModalD from "./Modal/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const CustomerDetail = ({ onUpdateSuccess, data, customerPk }) => {
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/edit.png";

  // Step 1: Add a state to manage the visibility of the EditModal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(data); // initialCustomerData는 초기 고객 데이터입니다.
  // Step 2: Add an event handler that sets showEditModal to true when the edit icon is clicked
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // const handleUpdateSuccess = (updatedCustomerData) => {
  //   setSelectedCustomer(updatedCustomerData);
  // };
  // const handleModalClose = () => {
  //   setShowEditModal(false);
  // Optionally, refresh customer data if it has been modified in the modal
  // };

  return (
    <div className="customer-detail-container">
      <div
        className="backpage"
        style={{ marginTop: "30px", marginBottom: "40px" }}
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
      <div>
        <Button
          className="customer_tnp"
          style={{
            display: "flex",
            width: "34px",
            height: "24px",
            marginBottom: "10px",
            padding: "4.84px 8.067px",
            justifyContent: "center",
            alignItems: "center",
            gap: "6.454px",
            fontWeight: "bold",
            borderBlockWidth: "2px",
            borderRightWidth: "2px",
            borderLeftWidth: "2px",
            cursor: "default",
          }}
          variant="success"
        >
          {data.customerType}
        </Button>
        <div
          className="customerdetail_editmodal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", cursor: "default" }}
          >
            <h2 className="customerName">{data.name}</h2>
            <h2>
              <Form.Check
                className="Detail_checkbox"
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
              src={imageUrl}
              style={{
                paddingTop: "8px",
                marginLeft: "12px",
                cursor: "pointer",
              }}
              onClick={handleEditClick}
            />
            <EditModalD
              show={showEditModal}
              onClose={(updatedData) => {
                // 업데이트된 데이터로 상태를 변경합니다.
                setSelectedCustomer(updatedData);
              }}
              onHide={() => setShowEditModal(false)}
              selectedCustomer={data}
              onUpdateSuccess={onUpdateSuccess}
            />
          </div>
        </div>

        <p className="customerPhone" style={{ cursor: "default" }}>
          {data.phone}
        </p>
      </div>
    </div>
  );
};
export default CustomerDetail;
