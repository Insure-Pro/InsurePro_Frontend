import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function HistoryModalH({ show, onHide, selectedHistory }) {
  // const [show, setShow] = useState(false);
  const dateRef = useRef("");
  const addressRef = useRef("");
  const memoRef = useRef("");
  const [selectedProgressType, setSelectedProgressType] = useState("");

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const close_icon = process.env.PUBLIC_URL + "/Close.png";

  // const handleShow = () => {
  //   setShow(true);
  //   setIsHistoryModalOpen(true); // Set state in Detail when opening the modal
  // };
  // const handleClose = () => {
  //   setShow(false);
  //   // setIsHistoryModalOpen(false); // Reset state in Detail when closing the modal
  // };

  useEffect(() => {
    if (selectedHistory) {
      setSelectedProgressType(selectedHistory?.progress || "");
    }
  }, [selectedHistory]);

  const handleProgressTypeClick = (type) => {
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }
  };
  const [updatedHistory, setUpdatedHistory] = useState(selectedHistory);

  useEffect(() => {
    setUpdatedHistory(selectedHistory);
  }, [selectedHistory]);

  // const [editedHistory, setEditedHistory] = useState({
  //   progress: "",
  //   date: "",
  //   address: "",
  //   memo: "",
  // });

  // useEffect(() => {
  //   setEditedHistory(selectedHistory);
  // }, [selectedHistory]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditedHistory((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSaveChanges = async () => {
  //   try {
  //     const url = `${MAIN_URL}/schedule/${selectedHistory.pk}`;
  //     await axios.patch(url, editedHistory, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating history:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDateValue = dateRef.current.value.replace(/[./]/g, "-");
    const dateSend = formattedDateValue || dateRef.current.value;
    const formData = {
      date: dateSend,
      address: addressRef.current.value,
      memo: memoRef.current.value,
      progress: selectedProgressType,
    };

    try {
      const response = await axios.patch(
        `${MAIN_URL}/schedule/${selectedHistory.pk}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (response.status === 200) {
        onHide(); // 모달 닫기
      }
    } catch (err) {
      console.error("Error while submitting data", err);
    }
  };
  const customerTypeColors = {
    TA: "var(--Success-200)",
    AP: "var(--Success-300)",
    PT: "var(--Success-500)",
    PC: "var(--Success-700)",
  };

  //모달창 외부 클릭 시 닫힘
  // useEffect(() => {
  //   // Add event listener to document
  //   document.addEventListener("mousedown", onHide);
  //   return () => {
  //     // Remove event listener on cleanup
  //     document.removeEventListener("mousedown", onHide);
  //   };
  // }, []);

  return (
    <>
      <Modal
        show={show}
        // onHide={onHide}
        className="history-modal-style"
        style={{ marginTop: "130px" }}
      >
        <div class="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
          <div class="flex justify-between">
            <div>히스토리 추가</div>
            <img class="cursor-pointer" onClick={onHide} src={close_icon} />
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
                    {Object.keys(customerTypeColors).map((type, idx, array) => {
                      const isFirst = idx === 0;
                      const isLast = idx === array.length - 1;
                      let buttonStyle = {
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
                defaultValue={selectedHistory?.date}
                ref={dateRef}
                // value={editedHistory.date}
                // onChange={handleInputChange}
                class="h-7 w-[192px] rounded border text-center "
              />
            </div>

            <div class="mb-1 flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">장소</div>
              <input
                type="text"
                defaultValue={selectedHistory?.address}
                ref={addressRef}
                // value={editedHistory.address}
                // onChange={handleInputChange}
                class="h-7 w-[192px] rounded border text-center"
              />
            </div>
            <div class="flex h-[68px] pt-[6px] ">
              <div class="mr-[38px] w-[50px]">메모</div>
              <input
                as="textarea"
                rows={3}
                defaultValue={selectedHistory?.memo}
                ref={memoRef}
                // value={editedHistory.memo}
                // onChange={handleInputChange}
                class="h-[56px] w-[192px] rounded border text-center"
              />
            </div>
            <div>
              <button
                class=" mt-2 flex  h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
                type="submit"
                // onClick={handleSaveChanges}
              >
                변경사항 저장
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default HistoryModalH;
