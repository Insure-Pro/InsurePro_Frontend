import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
// import "../App.css";

const MapCustomerDetail = ({ customerPk, onClose }) => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const [customerData, setCustomerData] = useState("");
  const [scheduleData, setScheduleData] = useState("");

  useEffect(() => {
    if (customerPk) {
      axios
        .get(`${MAIN_URL}/customer/${customerPk}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => setCustomerData(response.data))
        .catch((error) =>
          console.error("Error fetching customer data:", error)
        );

      axios
        .get(`${MAIN_URL}/schedules/${customerPk}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => setScheduleData(response.data))
        .catch((error) =>
          console.error("Error fetching schedule data:", error)
        );
    }
  }, [customerPk]);

  if (!customerPk) return null;

  //   const handleClose = () => {
  //     onClose();
  //     // logic to close the MapCustomerDetail window
  //   };

  return (
    <div
      className="customer-details"
      style={{
        position: "absolute",
        left: "300px", // Adjust based on the width of the Map_customerList_container
        top: 0,
        width: "300px", // Or your desired width
        height: "100%", // Take full height
        backgroundColor: "rgba(245, 250, 255, 0.9)",
        zIndex: 2, // Ensure it's above other elements
        borderLeft: "2px solid #dde1e6",
        // borderRight: "2px solid #dde1e6",
        fontSize: "12px",
      }}
    >
      {/* <div style={{ width: "300px", height: "700px" }}>dafsdfasf</div> */}
      <div
        style={{
          display: "flex",
          width: "288px",
          height: "60px",
          fontSize: "14px",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "10px",
          padding: "8px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",

            color: "#175cd3",
            paddingRight: "8px",
          }}
        >
          {customerData.customerType}
        </div>
        <div>{customerData.name}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            cursor: "default",
          }}
        >
          <h7 style={{ marginBottom: "-4px" }}>
            <Form.Check
              className="Detail_checkbox"
              aria-label="option 1"
              checked={customerData.contractYn || false}
              readOnly
              style={{ marginLeft: "8px", marginTop: "-4px" }}
            />
          </h7>
        </div>
        <CloseButton
          onClick={onClose}
          style={{
            marginLeft: "auto",
            paddingRight: "8px",
          }}
        />
      </div>
      <hr style={{ margin: "0px" }} />
      <div
        className="MapCustomerDetail_item_wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: "8px",
          marginLeft: "10px",
        }}
      >
        <div>
          주소 : {customerData.dongString}
          {/* {customerData.address} */}
        </div>
        <div>전화번호 : {customerData.phone}</div>
        <div>
          생년월일 : {customerData.birth} ({customerData.age}세)
        </div>
        <div>특이사항 : {customerData.memo}</div>
        <div>인수상태 : {customerData.state}</div>
      </div>
      <hr style={{ margin: "0px", marginBottom: "10px" }} />
      {scheduleData &&
        scheduleData.map((schedule, index) => (
          <div className="MapCustomerDetail_item_container" key={index}>
            <div
              style={{
                // paddingRight: "8px",
                padding: "0px 12px",
                color: "#175cd3",
                fontWeight: "bold",

                display: "flex",
                alignItems: "center",
              }}
            >
              {schedule.progress}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
                textAlign: "left",
              }}
            >
              <div>
                {schedule.date} {schedule.address}
              </div>
              <div>{schedule.memo}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MapCustomerDetail;
