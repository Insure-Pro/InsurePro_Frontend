import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useAddCustomerProgress } from "../../hooks/CustomerProgress/useAddCustomerProgress";

function HistoryModal({ customerPk, setIsHistoryModalOpen }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const addMutation = useAddCustomerProgress();

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
    addMutation.mutate({
      date,
      address,
      memo,
      progress: selectedProgressType,
      customerPk,
    });
    handleClose();
  };

  const progressTypeDisplay = {
    AP: "초회상담",
    PC: "상품제안",
    ST: "증권전달",
  };

  const progressTypeColors = {
    초회상담: "var(--Success-300)",
    상품제안: "var(--Success-500)",
    증권전달: "var(--Success-700)",
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
        className="Add_Btn2 ml-1 flex h-4 w-4 pt-[2.5px] outline-0"
        onClick={handleShow}
      >
        <img src={add_icon} class="ml-1 mt-[-1.5px]" />
      </button>

      <Modal
        className="history-modal-style mt-[130px]"
        show={show}
        onHide={handleClose}
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
                    {Object.keys(progressTypeDisplay).map(
                      (type, idx, array) => {
                        const koreanName = progressTypeDisplay[type]; // Get Korean name using the English code
                        const isFirst = idx === 0;
                        const isLast = idx === array.length - 1;
                        let buttonStyle = {
                          color:
                            selectedProgressType === type
                              ? "white"
                              : "var(--Gray-scale-100)",
                          backgroundColor:
                            selectedProgressType === type
                              ? progressTypeColors[koreanName]
                              : "transparent",
                          borderColor:
                            selectedProgressType === type
                              ? progressTypeColors[koreanName]
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
                            className="flex h-7 w-16 items-center justify-center border border-gray-300 px-[14px] py-[5px] outline-none"
                            type="button"
                            style={buttonStyle}
                            value={selectedProgressType}
                            onClick={() => handleProgressTypeClick(type)} // Using English codes for internal state management
                          >
                            {koreanName}
                          </button>
                        );
                      },
                    )}
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
          </form>
        </div>
      </Modal>
    </>
  );
}

export default HistoryModal;
