import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import axios from "axios";

const KakaoMap = () => {
  useEffect(() => {
    const initializeMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(36.2683, 127.6358),
        level: 14,
      };
      const map = new window.kakao.maps.Map(container, options);

      //   const markerPosition = new window.kakao.maps.LatLng(
      //     33.450701,
      //     126.570667
      //   );
      //   const marker = new window.kakao.maps.Marker({
      //     position: markerPosition,
      //   });
      //   marker.setMap(map);
      // 여기에 마커 클러스터 등 추가 로직을 구현할 수 있습니다.
    };

    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const kakaoScript = document.createElement("script");
      kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=5f312e942c7a1fa1133c655d80e8230e&autoload=true`;
      document.head.appendChild(kakaoScript);

      kakaoScript.onload = () => {
        window.kakao.maps.load(initializeMap);
      };
    }
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
