import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Test() {
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // const formData = new FormData();
    const data = {
      customerTypePk: 1,
    };

    axios
      .post("http://52.79.81.200:8080/v1/customer", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sImlkIjoidGVzdElkMTIzIiwic3ViIjoidXRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjkzMTA1ODc5LCJleHAiOjE2OTMxMDc2Nzl9.1lYKsLODXul3e54nUPf2vWdPlrfYuFV-dTPBZPUp0Lg",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert("신규고객 등록이 완료되었습니다.");
          navigate("/Main");
          handleClose(); // Modal 창 닫기
        }
      })
      .catch((error) => {
        console.error("API 요청 에러:", error.message);
      });
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>신규고객 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                저장
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Test;
