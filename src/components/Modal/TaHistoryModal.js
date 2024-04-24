import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useAddCustomerTa } from "../../hooks/CustomerTa/useAddCustomerTa";

function TaHistoryModal({ customerPk, setIsTaHistoryModalOpen }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedTaType, setSelectedTaType] = useState("");
  const addMutation = useAddCustomerTa();

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";

  const handleClose = () => {
    setShow(false);
    setIsTaHistoryModalOpen(false); // Reset state in Detail when closing the modal
    setDate("");
    setTime("");
    setMemo("");
    setSelectedTaType("");
  };
  const handleShow = () => {
    setShow(true);
    setIsTaHistoryModalOpen(true); // Set state in Detail when opening the modal
  };

  const handleProgressTypeClick = (type) => {
    if (selectedTaType === type) {
      setSelectedTaType("");
    } else {
      setSelectedTaType(type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate({
      date,
      // address,
      memo,
      status: selectedTaType,
      // delYn: "false",
      customerPk,
      time,
    });

    handleClose();
  };

  const taTypeDisplay = {
    ABSENCE: "부재",
    REJECTION: "거절",
    PROMISE: "확약",
    AS_TARGET: "AS",
  };
  const taTypeColors = {
    AS: "var(--Success-200)",
    부재: "var(--Success-300)",
    확약: "var(--Success-500)",
    거절: "var(--Success-700)",
  };
  // -----------------------------------------------

  // ABSENCE : 부재
  // REJECTION : 거절
  // PROMISE : 확약
  // AS_TARGET : AS 대상
  // -----------------------------------------------

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
          <form onSubmit={handleSubmit} class="pl-8">
            <div>
              <div className="mb-1  mt-2 flex h-10 w-[352px] items-center ">
                <div class=" flex items-center">
                  <div className="mr-[38px] w-[50px] cursor-default ">
                    {" "}
                    진척도
                  </div>
                  <div class="flex h-7 w-[192px] items-center   whitespace-nowrap  ">
                    {Object.keys(taTypeDisplay).map((type, idx, array) => {
                      const koreanName = taTypeDisplay[type]; // Get Korean name using the English code
                      const isFirst = idx === 0;
                      const isLast = idx === array.length - 1;
                      let buttonStyle = {
                        color:
                          selectedTaType === type
                            ? "white"
                            : "var(--Gray-scale-100)",
                        backgroundColor:
                          selectedTaType === type
                            ? taTypeColors[koreanName]
                            : "transparent",
                        borderColor:
                          selectedTaType === type
                            ? taTypeColors[koreanName]
                            : "var(--Gray-scale-100)",
                        fontWeight: selectedTaType === type ? "bold" : "normal",
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
                          value={selectedTaType}
                          onClick={() => handleProgressTypeClick(type)}
                        >
                          {koreanName}
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
                type="time"
                // placeholder="Address"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
          </form>
        </div>
      </Modal>
    </>
  );
}

export default TaHistoryModal;
