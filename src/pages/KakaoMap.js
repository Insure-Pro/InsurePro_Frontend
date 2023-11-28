import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoMap = () => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  const [visibleCustomers, setVisibleCustomers] = useState([]);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 35.1379222, // Default latitude (Busan City Hall)
    lng: 129.05562775, // Default longitude (Busan City Hall)
  });
  const [locationObtained, setLocationObtained] = useState(false);
  const [markers, setMarkers] = useState([]); // New state for storing marker objects

  const marker_blue = process.env.PUBLIC_URL + "/marker.png";
  const marker_red = process.env.PUBLIC_URL + "/marker_red.png";
  const refresh = process.env.PUBLIC_URL + "/map_refresh_icon.png";

  const createCurrentLocationCircle = (map, position) => {
    new window.kakao.maps.Circle({
      map: mapRef.current,
      center: new window.kakao.maps.LatLng(position.lat, position.lng),
      radius: 5,
      strokeWeight: 5,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      fillColor: "#FF0000",
      fillOpacity: 0.7,
    });
  };
  let clusterer; // Declare clusterer globally

  const initializeMap = () => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 3,
    };
    mapRef.current = new window.kakao.maps.Map(container, options); // Modify this line

    // const map = new window.kakao.maps.Map(container, options);
    const geocoder = new window.kakao.maps.services.Geocoder();

    // New: Initialize marker clusterer
    clusterer = new window.kakao.maps.MarkerClusterer({
      map: mapRef.current, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minLevel: 5, // 클러스터 할 최소 지도 레벨
      disableClickZoom: true,
      calculator: [10, 30, 50, 100], // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
      styles: [
        {
          // calculator 각 사이 값 마다 적용될 스타일을 지정한다
          width: "30px",
          height: "30px",
          background: "#1570EF",
          borderRadius: "15px",
          opacity: "0.8",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: "31px",
        },
        {
          width: "40px",
          height: "40px",
          background: "#009883",
          borderRadius: "20px",
          opacity: "0.8",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: "41px",
        },
        {
          width: "50px",
          height: "50px",
          background: "rgba(255, 51, 204, .8)",
          borderRadius: "25px",
          opacity: "0.8",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: "51px",
        },
        {
          width: "60px",
          height: "60px",
          background: "rgba(255, 80, 80, .8)",
          borderRadius: "30px",
          opacity: "0.8",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: "61px",
        },
      ],
    });

    // Create a map type control
    const mapTypeControl = new window.kakao.maps.MapTypeControl();

    // Add the map type control to the map
    mapRef.current.addControl(
      mapTypeControl,
      window.kakao.maps.ControlPosition.RIGHT
    );

    // Create a zoom control
    const zoomControl = new window.kakao.maps.ZoomControl();

    // Add the zoom control to the map
    mapRef.current.addControl(
      zoomControl,
      window.kakao.maps.ControlPosition.RIGHT
    );

    const markerImageBlue = new window.kakao.maps.MarkerImage(
      marker_blue,
      new window.kakao.maps.Size(28, 28),
      { offset: new window.kakao.maps.Point(27, 69) }
    );

    const markerImageGreen = new window.kakao.maps.MarkerImage(
      marker_red,
      new window.kakao.maps.Size(28, 28),
      { offset: new window.kakao.maps.Point(27, 69) }
    );

    // Existing Axios request to fetch markers
    axios
      .get(`${MAIN_URL}/customers/latest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        response.data.forEach((customer) => {
          if (customer.address && customer.address.trim() !== "") {
            geocoder.addressSearch(customer.address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );
                const marker = new window.kakao.maps.Marker({
                  position: coords,
                  image: markerImageBlue,
                });
                // Add click event listener
                window.kakao.maps.event.addListener(
                  marker,
                  "click",
                  function () {
                    const currentImage = marker.getImage();
                    if (currentImage === markerImageBlue) {
                      marker.setImage(markerImageGreen);
                    } else {
                      marker.setImage(markerImageBlue);
                    }
                  }
                );

                clusterer.addMarker(marker); // Add each marker to clusterer
              } else if (
                status === window.kakao.maps.services.Status.ZERO_RESULT
              ) {
                // Log the address that could not be found
                console.log(`Address not found: ${customer.address}`);
              } else {
                console.error(
                  `Geocode was not successful for the following reason: ${status}`
                );
              }
            });
          }
        });
        // After markers are added, call refreshCustomerList to populate the list
        refreshCustomerList();
      })
      .catch((error) => console.log(error));

    // New: Add event listener for cluster click
    window.kakao.maps.event.addListener(
      clusterer,
      "clusterclick",
      (cluster) => {
        // const level = map.getLevel() - 1;
        // map.setLevel(level, { anchor: cluster.getCenter() });
      }
    );

    if (locationObtained) {
      createCurrentLocationCircle(mapRef.current, mapCenter);
    }
  };

  // 전역 변수나 상태로 모든 고객의 좌표를 저장
  const [allCustomerCoords, setAllCustomerCoords] = useState([]);

  // 고객 데이터 가져오기 및 좌표 저장
  useEffect(() => {
    axios
      .get(`${MAIN_URL}/customers/latest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const customers = response.data;

        const geocoder = new window.kakao.maps.services.Geocoder();

        customers.forEach((customer) => {
          if (customer.address && customer.address.trim() !== "") {
            geocoder.addressSearch(customer.address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = {
                  lat: result[0].y,
                  lng: result[0].x,
                  ...customer, // 고객 정보 포함
                };
                setAllCustomerCoords((prev) => [...prev, coords]);
              }
            });
          }
        });
      })
      .catch((error) => console.error("Error fetching all customers:", error));
  }, []);

  function refreshCustomerList() {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      const filteredCustomers = allCustomerCoords.filter((customer) => {
        return (
          customer.lat >= swLatLng.getLat() &&
          customer.lat <= neLatLng.getLat() &&
          customer.lng >= swLatLng.getLng() &&
          customer.lng <= neLatLng.getLng()
        );
      });

      setVisibleCustomers(filteredCustomers);
    }
  }

  useEffect(() => {
    if (!locationObtained && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationObtained(true);
        },
        () => {
          console.log("Unable to retrieve your location");
          setLocationObtained(true);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    }
  }, [locationObtained]);

  //카카오맵 라이브러리가 완전히 로드된 후에만 initializeMap이 호출되도록
  useEffect(() => {
    if (locationObtained && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
    }
  }, [locationObtained, mapCenter]);

  const navigate = useNavigate();

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0"
  )}`; // formattedDate 업데이트

  const handleMonthCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "월별 고객", formattedDate } });
  };

  const handleAllCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "전체" } });
  };

  const handleContractCompleteClick = () => {
    navigate("/main", { state: { selectedTab: "계약완료고객" } });
  };

  return (
    <div
      style={{
        display: "flex",
        width: "1400px",
        height: "100vh",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
        userSelect: "none",
      }}
    >
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
      />
      <div style={{}}>
        <h1
          className="maintitle"
          style={{ margin: "25px 40px 10px 32px", cursor: "default" }}
        >
          지도보기
        </h1>
        {/* Main Content Container */}
        <div
          style={{
            position: "relative",
            marginLeft: "40px",
            marginTop: "24px",
            width: "1100px",
            height: "650px",
          }}
        >
          {/* Refresh Button */}
          <button
            className="Map_Search_Btn"
            style={{
              position: "absolute",
              bottom: "10px", // Position from bottom
              left: "50%", // Center horizontally
              transform: "translateX(-50%)", // Adjust for the button's width to center
              zIndex: 3, // Ensure it's above the map
            }}
            onClick={refreshCustomerList}
          >
            <img src={refresh} style={{ paddingRight: "16px" }} />현 지도에서
            검색
          </button>

          {/* Map Container */}
          <div
            id="map"
            style={{
              width: "100%", // Use full width of the container
              height: "100%", // Use full height of the container
              position: "relative",
              zIndex: 1,
              border: "1px solid #C9CAC9",
            }}
          >
            <div
              className="Map_customerList_container"
              style={{
                position: "absolute",
                width: "300px",
                height: "650px", // 높이를 "100%"로 설정
                backgroundColor: "white",
                opacity: "0.8",
                paddingTop: "12px",
                overflowY: "auto",
                zIndex: 2,
              }}
            >
              {visibleCustomers.map((customer, index) => (
                <div key={index}>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                    }}
                  >
                    <div className="inline-container-left">
                      <p className="customer-info customer-type">
                        {customer.customerType}
                      </p>
                      <p className="customer-info">{customer.name}</p>
                    </div>
                    <div className="inline-container-right">
                      <p className="customer-info font12">{customer.phone}</p>
                      <p className="customer-info font12">{customer.address}</p>
                    </div>
                  </div>
                  <hr
                    className="Map_list_hr"
                    style={{
                      width: "100%",
                      borderTop: "1px solid #000",
                      margin: "10px",
                      marginLeft: "0px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
