import axios from "axios";
import React, { useState, useEffect } from "react";
import "../../App.css";
import "../Analysis/Analysis.css";
import Navbar from "../../components/Main/Navbar/Navbar";
import DateChangeAModal from "../../components/Modal/DateChangeAModal";
import ApGraph from "../../components/Graph/ApGraph";
import TaGraph from "../../components/Graph/TaGraph";
import PcGraph from "../../components/Graph/PcGraph";
import ContractGraph from "../../components/Graph/ContractGraph";
import { PropagateLoader } from "react-spinners";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";

const Analysis = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-01`,
  );

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formattedDate = () =>
    `${year}년 ${month.toString().padStart(2, "0")}월`;

  const updateDate = () => {
    const now = new Date(); // 현재 날짜와 시간을 가진 Date 객체 생성
    const year = now.getFullYear(); // 현재 연도
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 현재 월 (getMonth는 0부터 시작하므로 1을 더함)
    const day = now.getDate().toString().padStart(2, "0"); // 현재 일
    const hours = now.getHours().toString().padStart(2, "0"); // 현재 시간

    // 형식화된 날짜와 시간 문자열을 반환
    return `${year}년 ${month}월 ${day}일 ${hours}시`;
  };

  const right_icon = process.env.PUBLIC_URL + "/arrow-right.png";

  const { data: customerTypes, isLoading } = useCustomerTypes();

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleDateChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    setDate(formattedDate2);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!customerTypes || isLoading) return;

      setLoading(true);
      setError(null);

      try {
        const responses = await Promise.all(
          customerTypes.map((customerType) =>
            axios
              .get(
                `${MAIN_URL}/analysis?date=${date}&customerTypePk=${customerType.pk}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken",
                    )}`,
                  },
                },
              )
              .then((response) => ({
                type: customerType.name,
                data: response.data,
                color: customerType.color,
              }))
              .catch((err) => ({
                type: customerType.name,
                data: null,
                color: customerType.color,
                error: err,
              })),
          ),
        );

        // Filter out the responses that have data (valid API responses)
        const validResponses = responses.filter(
          (response) => response.data !== null,
        );

        // Map responses to an object with customerType keys
        const newData = validResponses.reduce((acc, response) => {
          acc[response.type] = {
            ...response.data,
            color: response.color, // Include the color in the data
          };
          return acc;
        }, {});

        setData(newData);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    fetchData();
  }, [date, customerTypes, isLoading]);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PropagateLoader color="#84CAFF" size={20} speedMultiplier={0.8} />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  if (!customerTypes || customerTypes.length === 0) {
    return <div>No customer types available.</div>;
  }

  const allTaCount = customerTypes.reduce(
    (total, type) =>
      total + (data[type.name]?.taCustomerCount?.promiseCount || 0),
    0,
  );
  const allApCount = customerTypes.reduce(
    (total, type) =>
      total + (data[type.name]?.scheduleCustomerCount?.apCount || 0),
    0,
  );
  const allPcCount = customerTypes.reduce(
    (total, type) =>
      total + (data[type.name]?.scheduleCustomerCount?.pcCount || 0),
    0,
  );
  const allContractCount = customerTypes.reduce(
    (total, type) => total + (data[type.name]?.contractCount || 0),
    0,
  );

  return (
    <div className="w-screen">
      <Navbar />
      <div
        className={`select-none justify-center ${
          showModal ? "blur-background no-interaction" : ""
        }`}
        style={{ marginTop: showModal ? "-36px" : "" }}
      >
        <div className="flex h-10 items-center justify-center px-12">
          {showModal && (
            <DateChangeAModal
              initialYear={year}
              initialMonth={month}
              onDateChange={handleDateChange}
              onClose={() => setShowModal(false)}
            />
          )}

          <div
            className="analysis_subtitle_left"
            onClick={() => setShowModal(true)}
          >
            <div>{formattedDate()}</div>
            <img className="pl-1" src={right_icon}></img>
          </div>
          <div className="analysis_subtitle">
            <span>총 TA 개수 : {allTaCount}</span>
            <span>AP 개수: {allApCount}</span>
            <span>PC 개수: {allPcCount}</span>
            <span> 청약 건수: {allContractCount}</span>
          </div>
        </div>
        <div className="flex h-screen w-full justify-center bg-LightMode-SectionBackground">
          <div className="analysis_container mx-12 pt-6">
            <div className="analysis_explain">
              <div>안내</div>
              <div className="analysis_explain_item">
                <span className="explain_item_title">TA 확률 </span>
                <span>:</span>
                {"     "}
                <span> TA 개수/ 이번달 분배받은 db고객 수 기준</span>
              </div>
              <div className="analysis_explain_item">
                <span className="explain_item_title">AP 확률 </span>{" "}
                <span>:</span>
                <span> AP 개수/ 이번달 분배받은 db고객 수 기준</span>
              </div>
              <div className="analysis_explain_item">
                <span className="explain_item_title">PC 확률 </span>{" "}
                <span>:</span>
                <span> PC 개수/ 이번달 분배받은 db고객 수 기준</span>
              </div>
              <div className="analysis_explain_item">
                <span className="explain_item_title">청약 건수 </span>{" "}
                <span>:</span>
                <span> 청약 건수/ 이번달 분배받은 db고객 수 기준</span>
              </div>
            </div>
            <div className="analysis_graph1 bg-white">
              <span
                style={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "start",
                  paddingLeft: "18px",
                  paddingTop: "16px",
                  marginBottom: "-8px",
                  fontWeight: "600",
                  color: "var(--LightMode-Subtext)",
                }}
              >
                월 Ta 개수
              </span>
              {/* <div
                className="Ta_ratio_item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  fontSize: "14px",
                  marginRight: "22px",
                }}
              > */}
              {/* {customerTypes.map((type) => (
                  <span key={type.pk}>
                    {Math.round(
                      data[type.name]?.customerConsultationRatio
                        ?.beforeConsultationRatio * 100,
                    )}
                    %
                  </span>
                ))} */}
              {/* </div> */}
              <TaGraph
                data={customerTypes.reduce((acc, type) => {
                  acc[type.name] = {
                    ratio:
                      data[type.name]?.customerConsultationRatio
                        ?.beforeConsultationRatio || 0,
                    count: data[type.name]?.taCustomerCount?.promiseCount || 0,
                    color: data[type.name]?.color, // Passing color dynamically
                  };
                  return acc;
                }, {})}
              />
            </div>
            <div className="analysis_graph2  bg-white">
              <span
                style={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "start",
                  paddingLeft: "18px",
                  paddingTop: "16px",
                  marginBottom: "-8px",
                  fontWeight: "600",
                  color: "var(--LightMode-Subtext)",
                }}
              >
                월 AP 개수
              </span>
              {/* <div
                className="Ta_ratio_item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  fontSize: "14px",
                  marginRight: "22px",
                }}
              >
                <span>{Math.round(data["OD"]?.apratio * 100)}%</span>
                <span>{Math.round(data["AD"]?.apratio * 100)}%</span>
                <span>{Math.round(data["CD"]?.apratio * 100)}%</span>
                <span>{Math.round(data["CP"]?.apratio * 100)}%</span>
                <span>{Math.round(data["JD"]?.apratio * 100)}%</span>
              </div> */}
              <ApGraph
                data={customerTypes.reduce((acc, type) => {
                  acc[type.name] = {
                    // ratio:
                    //   data[type.name]?.customerConsultationRatio
                    //     ?.beforeConsultationRatio || 0,
                    count: data[type.name]?.scheduleCount?.apCount || 0,
                    color: data[type.name]?.color, // Passing color dynamically
                  };
                  return acc;
                }, {})}
              />
            </div>
            <div className="analysis_graph3  bg-white">
              <span
                style={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "start",
                  paddingLeft: "18px",
                  paddingTop: "16px",
                  marginBottom: "-8px",
                  fontWeight: "600",
                  color: "var(--LightMode-Subtext)",
                }}
              >
                월 PC 개수
              </span>
              {/* <div
                className="Ta_ratio_item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  fontSize: "14px",
                  marginRight: "22px",
                }}
              >
                <span>{Math.round(data["OD"]?.pcratio * 100)}%</span>
                <span>{Math.round(data["AD"]?.pcratio * 100)}%</span>
                <span>{Math.round(data["CD"]?.pcratio * 100)}%</span>
                <span>{Math.round(data["CP"]?.pcratio * 100)}%</span>
                <span>{Math.round(data["JD"]?.pcratio * 100)}%</span>
              </div> */}
              <PcGraph
                data={customerTypes.reduce((acc, type) => {
                  acc[type.name] = {
                    // ratio:
                    //   data[type.name]?.customerConsultationRatio
                    //     ?.beforeConsultationRatio || 0,
                    count: data[type.name]?.scheduleCount?.pcCount || 0,
                    color: data[type.name]?.color, // Passing color dynamically
                  };
                  return acc;
                }, {})}
              />
            </div>
            <div className="analysis_graph4  bg-white">
              <span
                style={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "start",
                  paddingLeft: "28px",
                  paddingTop: "16px",
                  marginBottom: "-8px",
                  color: "var(--LightMode-Subtext)",
                }}
              >
                청약 건수
              </span>
              <ContractGraph
                data={customerTypes.reduce((acc, type) => {
                  acc[type.name] = {
                    count: data[type.name]?.scheduleCount?.pcCount || 0,
                    color: data[type.name]?.color, // Passing color dynamically
                  };
                  return acc;
                }, {})}
              />
            </div>
            <div className="updateMessage">
              {updateDate()}에 마지막으로 업데이트 되었습니다.{" "}
            </div>
            {/* </div> */}
            {/* Rest of your component */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
