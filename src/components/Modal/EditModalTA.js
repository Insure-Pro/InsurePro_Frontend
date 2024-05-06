import { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function EditModalTA({ show, onHide, onSave, selectedTA }) {
  const dateRef = useRef("");
  const timeRef = useRef("");
  const memoRef = useRef("");
  const [selectedTaType, setSelectedTaType] = useState("");
  const [updatedHistory, setUpdatedHistory] = useState(selectedTA);

  const close_icon = process.env.PUBLIC_URL + "/Close.png";

  useEffect(() => {
    if (selectedTA) {
      setSelectedTaType(selectedTA?.status || "");
    }
  }, [selectedTA]);

  const handleProgressTypeClick = (type) => {
    if (selectedTaType === type) {
      setSelectedTaType("");
    } else {
      setSelectedTaType(type);
    }
  };

  useEffect(() => {
    setUpdatedHistory(selectedTA);
  }, [selectedTA]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedHistory = {
      pk: selectedTA.pk,
      date: dateRef.current.value,
      time: timeRef.current.value,
      memo: memoRef.current.value,
      status: selectedTaType,
    };
    onSave(editedHistory); // Call onSave which is actually handleEdit from CustomerHistory
    onHide(); // 모달 닫기
  };

  const taTypeDisplay = {
    ABSENCE: "부재",
    REJECTION: "거절",
    PROMISE: "확약",
    PENDING: "보류",
    // AS_TARGET: "AS",
  };
  const taTypeColors = {
    보류: "var(--Success-500)",
    부재: "var(--Warning-300)",
    확약: "var(--Primary-400)",
    거절: "var(--Danger-400)",
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
            <div>히스토리 변경</div>
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
                defaultValue={selectedTA?.date}
                ref={dateRef}
                class="h-7 w-[192px] rounded border text-center "
              />
            </div>

            <div class="mb-1 flex h-10 items-center">
              <div class="mr-[38px] w-[50px]">시간</div>
              <input
                type="time"
                defaultValue={selectedTA?.time}
                ref={timeRef}
                class="h-7 w-[192px] rounded border text-center"
              />
            </div>
            <div class="flex h-[68px] pt-[6px] ">
              <div class="mr-[38px] w-[50px]">메모</div>
              <textarea
                rows={3}
                defaultValue={selectedTA?.memo}
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

export default EditModalTA;
