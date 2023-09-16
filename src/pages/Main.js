import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";

const Main = () => {
  const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.

  useEffect(() => {
    // 데이터를 로드하는 함수를 정의합니다.
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://52.79.81.200:8080/v1/customers/latest",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error("Data loading error:", error.message);
      }
    };

    fetchData(); // 함수를 호출하여 데이터를 로드합니다.
  }, []);

  return (
    <div>
      <div className="Db_container">
        <Dbbar>
          <div className="Add_Btn">
            <Modal1 />
          </div>
          <div className="Db_content">
            <div>DB 분배일</div>
            <div>고객유형</div>
            <div>이름</div>
            <div>생년월일 (나이)</div>
            <div>연락처</div>
            <div>거주지</div>
            {/* 가져온 데이터를 화면에 출력합니다. */}
            {customers
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
              .map((customer) => (
                <React.Fragment key={customer.pk}>
                  <div>{customer.createdAt}</div>
                  <div>{customer.customerTypeString}</div>
                  <div>{customer.name}</div>
                  <div>
                    {customer.birth} ({customer.age})
                  </div>
                  <div>{customer.phone}</div>
                  <div>{customer.address}</div>
                </React.Fragment>
              ))}
          </div>
        </Dbbar>
      </div>
    </div>
  );
};

export default Main;
