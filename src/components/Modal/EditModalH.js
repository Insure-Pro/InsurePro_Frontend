import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function HistoryModalH({ show, onHide, onSave, selectedHistory }) {
  const dateRef = useRef("");
  const addressRef = useRef("");
  const memoRef = useRef("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const [updatedHistory, setUpdatedHistory] = useState(selectedHistory);

  const close_icon = process.env.PUBLIC_URL + "/Close.png";

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

  useEffect(() => {
    setUpdatedHistory(selectedHistory);
  }, [selectedHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedHistory = {
      pk: selectedHistory.pk,
      date: dateRef.current.value,
      address: addressRef.current.value,
      memo: memoRef.current.value,
      progress: selectedProgressType,
    };
    onSave(editedHistory); // Call onSave which is actually handleEdit from CustomerHistory
    onHide(); // 모달 닫기
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
                            className="flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
                            type="button"
                            style={buttonStyle}
                            value={selectedProgressType}
                            onClick={() => handleProgressTypeClick(type)}
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
                defaultValue={selectedHistory?.date}
                ref={dateRef}
                class="h-7 w-[192px] rounded border text-center "
              />
            </div>

            <div class="mb-1 flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">장소</div>
              <input
                type="text"
                defaultValue={selectedHistory?.address}
                ref={addressRef}
                class="h-7 w-[192px] rounded border text-center"
              />
            </div>
            <div class="flex h-[68px] pt-[6px] ">
              <div class="mr-[38px] w-[50px]">메모</div>
              <textarea
                rows={3}
                defaultValue={selectedHistory?.memo}
                ref={memoRef}
                class="h-[56px] w-[192px] rounded border px-3 pt-2 "
              />
            </div>
            <div>
              <button
                class=" mt-2 flex  h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
                type="submit"
              >
                변경사항 저장
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default HistoryModalH;
