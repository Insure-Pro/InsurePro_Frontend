import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Main/Navbar";
import DateChangeAModal from "../components/Modal/DateChangeAModal";
import ApGraph from "../components/Graph/ApGraph";
import TaGraph from "../components/Graph/TaGraph";
import PcGraph from "../components/Graph/PcGraph";
import ContractGraph from "../components/Graph/ContractGraph";
import { PropagateLoader } from "react-spinners";

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

  const customerTypes = ["OD", "AD", "CD", "CP", "JD"];

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

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  // Function to handle date changes from the modal
  const handleDateChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    setDate(formattedDate2);
    setShowModal(false); // Close modal after date change
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          customerTypes.map((customerType) =>
            fetch(
              `${MAIN_URL}/analysis?date=${date}&customerType=${customerType}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken",
                  )}`,
                },
              },
            ).then((response) => response.json()),
          ),
        );

        // Map responses to an object with customerType keys
        const newData = responses.reduce((acc, response, index) => {
          acc[customerTypes[index]] = response;
          return acc;
        }, {});

        setData(newData);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [date]);

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

  const allTaCount =
    data["OD"]?.ta +
    data["AD"]?.ta +
    data["CD"]?.ta +
    data["CP"]?.ta +
    data["JD"]?.ta;
  const allApCount =
    data["OD"]?.ap +
    data["AD"]?.ap +
    data["CD"]?.ap +
    data["CP"]?.ap +
    data["JD"]?.ap;
  const allPcCount =
    data["OD"]?.pc +
    data["AD"]?.pc +
    data["CD"]?.pc +
    data["CP"]?.pc +
    data["JD"]?.pc;
  const allContractCount =
    data["OD"]?.subscriptionCount +
    data["AD"]?.subscriptionCount +
    data["CD"]?.subscriptionCount +
    data["CP"]?.subscriptionCount +
    data["JD"]?.subscriptionCount;

  return (
    <div className="Detail_container w-screen">
      <Navbar />
      <div
        className={`select-none   justify-center ${
          showModal ? "blur-background no-interaction" : ""
        } `}
        style={{ marginTop: showModal ? "-36px" : "" }}
      >
        <div class="flex h-10 items-center justify-center px-12">
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
            <img class="pl-1" src={right_icon}></img>
          </div>
          <div className="analysis_subtitle">
            <span>총 TA 개수 : {allTaCount}</span>
            <span>AP 개수: {allApCount}</span>
            <span>PC 개수: {allPcCount}</span>
            <span> 청약 건수: {allContractCount}</span>
          </div>
        </div>
        <div class="flex h-screen w-full justify-center bg-LightMode-SectionBackground">
          <div className="analysis_container mx-12  pt-6">
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
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--LightMode-Subtext)",
                }}
              >
                Ta 확률
              </span>
              <div
                className="Ta_ratio_item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  fontSize: "14px",
                  marginRight: "22px",
                }}
              >
                <span>{Math.round(data["OD"]?.taratio * 100)}%</span>
                <span>{Math.round(data["AD"]?.taratio * 100)}%</span>
                <span>{Math.round(data["CD"]?.taratio * 100)}%</span>
                <span>{Math.round(data["CP"]?.taratio * 100)}%</span>
                <span>{Math.round(data["JD"]?.taratio * 100)}%</span>
              </div>
              <TaGraph
                data={{
                  OD: data["OD"]?.taratio,
                  ODcount: data["OD"]?.ta,
                  AD: data["AD"]?.taratio,
                  ADcount: data["AD"]?.ta,
                  CD: data["CD"]?.taratio,
                  CDcount: data["CD"]?.ta,
                  CP: data["CP"]?.taratio,
                  CPcount: data["CP"]?.ta,
                  JD: data["JD"]?.taratio,
                  JDcount: data["JD"]?.ta,
                }}
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
                AP 확률
              </span>
              <div
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
              </div>
              <ApGraph
                data={{
                  OD: data["OD"]?.apratio,
                  ODcount: data["OD"]?.ap,
                  AD: data["AD"]?.apratio,
                  ADcount: data["AD"]?.ap,
                  CD: data["CD"]?.apratio,
                  CDcount: data["CD"]?.ap,
                  CP: data["CP"]?.apratio,
                  CPcount: data["CP"]?.ap,
                  JD: data["JD"]?.apratio,
                  JDcount: data["JD"]?.ap,
                }}
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
                PC 확률
              </span>
              <div
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
              </div>
              <PcGraph
                data={{
                  OD: data["OD"]?.pcratio,
                  ODcount: data["OD"]?.pc,
                  AD: data["AD"]?.pcratio,
                  ADcount: data["AD"]?.pc,
                  CD: data["CD"]?.pcratio,
                  CDcount: data["CD"]?.pc,
                  CP: data["CP"]?.pcratio,
                  CPcount: data["CP"]?.pc,
                  JD: data["JD"]?.pcratio,
                  JDcount: data["JD"]?.pc,
                }}
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
                data={{
                  OD: data["OD"]?.subscriptionCount,
                  AD: data["AD"]?.subscriptionCount,
                  CD: data["CD"]?.subscriptionCount,
                  CP: data["CP"]?.subscriptionCount,
                  JD: data["JD"]?.subscriptionCount,
                }}
              />
            </div>
            <div className="updateMessage">
              {updateDate()}에 마지막으로 업데이트 되었습니다.{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
