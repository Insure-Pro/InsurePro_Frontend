import axios from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function HistoryModal({ customerPk, onNewData, setIsHistoryModalOpen }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";

  const handleClose = () => {
    setShow(false);
    setIsHistoryModalOpen(false); // Reset state in Detail when closing the modal
    setDate("");
    setAddress("");
    setMemo("");
    setSelectedProgressType("");
  };
  const handleShow = () => {
    setShow(true);
    setIsHistoryModalOpen(true); // Set state in Detail when opening the modal
  };

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

  const progressTypeColors = {
    TA: "var(--Success-200)",
    AP: "var(--Success-300)",
    PT: "var(--Success-500)",
    PC: "var(--Success-700)",
  };

  //모달창 외부 클릭 시 닫힘
  // useEffect(() => {
  //   // Add event listener to document
  //   document.addEventListener("mousedown", handleClose);
  //   return () => {
  //     // Remove event listener on cleanup
  //     document.removeEventListener("mousedown", handleClose);
  //   };
  // }, []);

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
          outline: "none",
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
        <div class="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
          <div class="flex justify-between">
            <div>히스토리 추가</div>
            <img
              class="cursor-pointer"
              onClick={handleClose}
              src={close_icon}
            />
          </div>
        </div>
        <div className="Modal_container">
          <Form onSubmit={handleSubmit}>
            <div>
              <div className="mb-1  mt-2 flex h-10 w-[352px] items-center ">
                <div class=" flex items-center">
                  <div className="mr-[38px] w-[50px] cursor-default ">
                    {" "}
                    진척도
                  </div>
                  <div class="flex h-7 w-[192px] items-center   whitespace-nowrap  ">
                    {Object.keys(progressTypeColors).map((type, idx, array) => {
                      const isFirst = idx === 0;
                      const isLast = idx === array.length - 1;
                      let buttonStyle = {
                        color:
                          selectedProgressType === type
                            ? "white"
                            : "var(--Gray-scale-100)",
                        backgroundColor:
                          selectedProgressType === type
                            ? progressTypeColors[type]
                            : "transparent",
                        borderColor:
                          selectedProgressType === type
                            ? progressTypeColors[type]
                            : "var(--Gray-scale-100)",
                        fontWeight:
                          selectedProgressType === type ? "bold" : "normal",
                      };

                      // Apply rounded corners for the first and last button
                      if (isFirst) {
                        buttonStyle.borderTopLeftRadius = "4px";
                        buttonStyle.borderBottomLeftRadius = "4px";
                      }
                      if (isLast) {
                        buttonStyle.borderTopRightRadius = "4px";
                        buttonStyle.borderBottomRightRadius = "4px";
                      }

                      return (
                        <button
                          key={idx}
                          className="flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
                          type="button"
                          style={buttonStyle}
                          value={selectedProgressType}
                          onClick={() => handleProgressTypeClick(type)}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-1 flex h-10 items-center">
              <div class=" mr-[38px] w-[50px]">일정시간</div>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                class="h-7 w-[192px] rounded border text-center "
              />
            </div>
            <div class="mb-1 flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">장소</div>
              <input
                type="text"
                // placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                class="h-7 w-[192px] rounded border text-center"
              />
            </div>
            <div class="flex h-[68px] pt-[6px] ">
              <div class="mr-[38px] w-[50px]">메모</div>
              <textarea
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                class="h-[56px] w-[192px] rounded border px-3 pt-2"
              />
            </div>

            <div>
              <button
                class=" mt-2 flex  h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
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
