import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function HistoryModal({ customerPk, onNewData }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["TA", "AP", "PT", "PC"];

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const add_icon = process.env.PUBLIC_URL + "/add_button.png";

  const handleClose = () => {
    setShow(false);
    setDate("");
    setAddress("");
    setMemo("");
    setSelectedProgressType("");
  };
  const handleShow = () => setShow(true);

  const handleProgressTypeClick = (type) => {
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formattedDateValue = date.replace(/[./]/g, "-");
    const formData = {
      date: formattedDateValue,
      address,
      memo,
      progress: selectedProgressType,
      delYn: "false",
    };
    try {
      await axios.post(`${MAIN_URL}/schedule/${customerPk}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      handleClose();
      onNewData();
    } catch (err) {
      console.log(formData);
      console.error("Error while submitting data", err);
    }
  };

  const customerTypeColors = {
    TA: "var(--colorN-4)",
    AP: "var(--colorN-4)",
    PT: "var(--colorN-4)",
    PC: "var(--colorN-4)",
  };

  return (
    <>
      <button
        className="Add_Btn2"
        onClick={handleShow}
        style={{
          display: "flex",
          width: "16px",
          height: "16px",
          paddingTop: "2.5px",
          marginLeft: "4px",
        }}
      >
        <img src={add_icon} class="ml-1 mt-[-1.5px]" />
      </button>

      <Modal
        className="history-modal-style"
        show={show}
        onHide={handleClose}
        style={{ marginTop: "130px" }}
      >
        <div class=' className="h-8 font-normal"  rounded-t-md bg-LightMode-SectionBackground px-7 py-[7px] text-sm'>
          <div style={{ marginRight: "16px" }}>
            <div>히스토리 추가</div>
          </div>
        </div>
        <div className="Modal_container">
          <Form onSubmit={handleSubmit}>
            <div>
              {/* {progressTypes.map((type, idx) => (
                <ToggleButton
                  key={idx}
                  type="button"
                  variant={
                    selectedProgressType === type
                      ? "primary"
                      : "outline-primary"
                  }
                  value={selectedProgressType}
                  onClick={() => handleProgressTypeClick(type)}
                  style={{ borderRadius: "0px" }}
                >
                  {type}
                </ToggleButton>
              ))} */}
              <div className="mb-1  mt-2 h-10 w-[352px] ">
                <div class=" flex items-center">
                  <div className="w-[84px] cursor-default pb-4"> 진척도</div>
                  <div class="flex h-12 w-52 items-center  overflow-x-scroll whitespace-nowrap  ">
                    {Object.keys(customerTypeColors).map((type, idx) => (
                      <button
                        key={idx}
                        className=" flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
                        type="button"
                        style={{
                          color:
                            selectedProgressType === type
                              ? "white"
                              : "var(--Gray-scale-100)",
                          backgroundColor:
                            selectedProgressType === type
                              ? customerTypeColors[type]
                              : "transparent",
                          borderColor:
                            selectedProgressType === type
                              ? customerTypeColors[type]
                              : "var(--Gray-scale-100)",
                          fontWeight:
                            selectedProgressType === type ? "bold" : "normal",
                        }}
                        // ref={customerType}
                        value={selectedProgressType}
                        onClick={() => handleProgressTypeClick(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">일정시간</div>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                class="h-7 w-[192px] border text-center"
              />
            </div>
            <div class="flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">장소</div>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                class="h-7 w-[192px] border text-center"
              />
            </div>
            <div class="mt-[10px] flex h-[68px] ">
              <div class="mr-[38px] w-[50px]">메모</div>
              <Form.Control
                as="textarea"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                class="h-[56px] w-[192px] border text-center"
              />
            </div>

            <div>
              <button
                class="mt-2 flex h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
                type="submit"
              >
                등록
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default HistoryModal;
