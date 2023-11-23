import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import axios from "axios";

const KakaoMap = () => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  useEffect(() => {
    const initializeMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(35.1379222, 129.05562775),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      const geocoder = new window.kakao.maps.services.Geocoder();

      axios
        .get(`${MAIN_URL}/customers/latest`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          response.data.forEach((customer) => {
            geocoder.addressSearch(customer.address, function (result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );
                new window.kakao.maps.Marker({
                  map: map,
                  position: coords,
                });
              }
            });
          });
        })
        .catch((error) => console.log(error));
    };

    window.kakao.maps.load(initializeMap);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "1400px",
        height: "100vh",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
      }}
    >
      <Navbar />
      <div>
        <h1 className="maintitle" style={{ margin: "40px" }}>
          지도보기
        </h1>
        <div
          id="map"
          style={{
            marginLeft: "40px",
            marginTop: "50px",
            width: "1000px",
            height: "600px",
          }}
        />
      </div>
    </div>
  );
};

export default KakaoMap;
