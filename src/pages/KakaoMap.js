/* global kakao */
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MapCustomerDetail from "../components/MapCustomerDetail";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PropagateLoader } from "react-spinners";

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
  const [selectedMarker, setSelectedMarker] = useState(null); // 클릭한 마커 색 변경 관리

  const marker_blue = process.env.PUBLIC_URL + "/marker_blue.png";
  const marker_red = process.env.PUBLIC_URL + "/marker_red.png";
  const search_white = process.env.PUBLIC_URL + "/search_white.png";
  const search = process.env.PUBLIC_URL + "/search.png";
  const refresh = process.env.PUBLIC_URL + "/map_refresh.png";

  const [isLoading, setIsLoading] = useState(true);

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const customerTypeColors = {
    OD: "var(--colorN-1)",
    AD: "var(--colorN-2)",
    CP: "var(--colorN-3)",
    CD: "var(--colorN-4)",
    JD: "var(--colorN-5)",
    H: "var(--colorN-6)",
    X: "var(--colorN-7)",
    Y: "var(--colorN-8)",
    Z: "var(--colorN-9)",
  };

  const createCurrentLocationCircle = (map, position) => {
    new window.kakao.maps.Circle({
      map: mapRef.current,
      center: new window.kakao.maps.LatLng(position.lat, position.lng),
      radius: 1,
      strokeWeight: 5,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      fillColor: "#FF0000",
      fillOpacity: 0.9,
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
      window.kakao.maps.ControlPosition.RIGHT,
    );

    // Create a zoom control
    const zoomControl = new window.kakao.maps.ZoomControl();

    // Add the zoom control to the map
    mapRef.current.addControl(
      zoomControl,
      window.kakao.maps.ControlPosition.RIGHT,
    );

    const markerImageBlue = new window.kakao.maps.MarkerImage(
      marker_blue,
      new window.kakao.maps.Size(21, 28),
      { offset: new window.kakao.maps.Point(27, 69) },
    );

    const markerImageRed = new window.kakao.maps.MarkerImage(
      marker_red,
      new window.kakao.maps.Size(21, 28),
      { offset: new window.kakao.maps.Point(27, 69) },
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
          if (customer.dongString && customer.dongString.trim() !== "") {
            geocoder.addressSearch(customer.dongString, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                setIsLoading(false);
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x,
                );
                const marker = new window.kakao.maps.Marker({
                  position: coords,
                  image: markerImageBlue,
                });
                setMarkers((prevMarkers) => [...prevMarkers, marker]);
                marker.setTitle(String(customer.pk));

                window.kakao.maps.event.addListener(
                  marker,
                  "click",
                  function () {
                    // 모든 마커의 이미지를 초기화
                    markers.forEach((m) => m.setImage(markerImageBlue));

                    // 현재 클릭된 마커의 이미지 변경
                    marker.setImage(markerImageRed);

                    // 선택된 마커 업데이트
                    setSelectedMarker(marker);
                    // MapCustomerDetail 컴포넌트 띄우기
                    setSelectedCustomerPk(customer.pk);
                    setIsDetailVisible(true);
                  },
                );

                // Create a custom overlay for the tooltip
                const content = `
                    <div class="custom-overlay">
                        <span style="margin-right: 8px;">${customer.customerType}</span>
                        <span>${customer.name}</span>
                        </div> `;
                // <span>${customer.name} (${customer.age})</span>

                const customOverlay = new window.kakao.maps.CustomOverlay({
                  content: content,
                  position: coords,
                  xAnchor: 0.65,
                  yAnchor: 3.4, // Adjust this to position the tooltip above the marker
                  zIndex: 3,
                });

                // Add event listeners to show/hide the tooltip
                window.kakao.maps.event.addListener(
                  marker,
                  "mouseover",
                  function () {
                    marker.setImage(markerImageRed);
                    customOverlay.setMap(mapRef.current);
                  },
                );

                window.kakao.maps.event.addListener(
                  marker,
                  "mouseout",
                  function () {
                    customOverlay.setMap(null);
                    marker.setImage(markerImageBlue);
                  },
                );

                clusterer.addMarker(marker); // Add each marker to clusterer
              } else if (
                status === window.kakao.maps.services.Status.ZERO_RESULT
              ) {
                // Log the dongString that could not be found
                console.log(`Address not found: ${customer.dongString}`);
              } else {
                console.error(
                  `Geocode was not successful for the following reason: ${status}`,
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
      },
    );

    if (locationObtained) {
      createCurrentLocationCircle(mapRef.current, mapCenter);
    }
  };

  // 전역 변수나 상태로 모든 고객의 좌표를 저장
  const [allCustomerCoords, setAllCustomerCoords] = useState([]);

  const handleCustomerClick = (customer) => {
    const marker = markers.find((m) => m.getTitle() === String(customer.pk));
    console.log(marker);
    if (marker) {
      mapRef.current.panTo(marker.getPosition());

      // 마커의 현재 상태를 확인하는 로직 수정
      // getDraggable() 함수를 사용하여 현재 마커의 상태를 추적 (예시)
      // Set all markers to blue first
      markers.forEach((m) => {
        m.setImage(
          new kakao.maps.MarkerImage(
            marker_blue,
            new window.kakao.maps.Size(21, 28),
            { offset: new window.kakao.maps.Point(27, 69) },
          ),
        );
        m.setDraggable(false);
      });

      // Then set the clicked marker to red
      marker.setImage(
        new kakao.maps.MarkerImage(
          marker_red,
          new window.kakao.maps.Size(21, 28),
          { offset: new window.kakao.maps.Point(27, 69) },
        ),
      );
      //선택한 마커 중앙으로 오고 빨강색으로 변경
      marker.setDraggable(true);

      // MapCustomerDetail 컴포넌트 띄우기 & 닫기
      // 선택된 고객이 이미 선택된 상태라면 Detail 컴포넌트를 닫습니다.
      if (selectedCustomerPk === customer.pk) {
        setIsDetailVisible(false);
        setSelectedCustomerPk(null);
      } else {
        setSelectedCustomerPk(customer.pk);
        setIsDetailVisible(true);
      }
    }
  };
  // 현 지도 검색 클릭 시 사용
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
          if (customer.dongString && customer.dongString.trim() !== "") {
            geocoder.addressSearch(customer.dongString, (result, status) => {
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

  // Add a new state to track if there are visible customers
  const [hasVisibleCustomers, setHasVisibleCustomers] = useState(true);

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

      // Update the state based on whether there are visible customers
      setHasVisibleCustomers(filteredCustomers.length > 0);
      setVisibleCustomers(filteredCustomers);
      setIsSearchMode(false); // Reset search mode
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
        },
      );
    }
  }, [locationObtained]);

  //카카오맵 라이브러리가 완전히 로드된 후에만 initializeMap이 호출되도록
  useEffect(() => {
    if (locationObtained && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
    }
  }, [locationObtained, mapCenter]);

  const [selectedCustomerPk, setSelectedCustomerPk] = useState(null);

  const Map_customer_DetailClose = () => {
    setIsDetailVisible(false);
  };

  const navigate = useNavigate();

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0",
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

  // const handleLogoClick = () => {
  //   navigate("/main", { state: { selectedTab: "로고" } });
  // };
  //////////  현재위치정보 리스트에 보여주는 로직 시작  //////////
  const [currentAddress, setCurrentAddress] = useState("");

  // Function to convert coordinates to an address
  const searchAddrFromCoords = (coords, callback) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
  };

  const updateAddress = () => {
    if (mapRef.current) {
      const mapCenter = mapRef.current.getCenter();
      searchAddrFromCoords(mapCenter, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const administrativeAddress = result.find(
            (r) => r.region_type === "H",
          );
          if (administrativeAddress) {
            setCurrentAddress(administrativeAddress.address_name);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      kakao.maps.event.addListener(mapRef.current, "idle", updateAddress);
      updateAddress();

      return () => {
        kakao.maps.event.removeListener(mapRef.current, "idle", updateAddress);
      };
    }
  }, [mapRef.current]);
  //////////  현재위치정보 리스트에 보여주는 로직 끝  //////////

  //////////  이름 검색 로직 시작  //////////
  const [inputName, setInputName] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [isDongSearch, setIsDongSearch] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  // Define an array of all the terms you want to check for in the search
  const searchTerms = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "시",
    "도",
    "군",
    "구",
    "동",
  ];

  // Update the useEffect that sets isDongSearch
  useEffect(() => {
    // Check if the inputName includes any of the terms in the searchTerms array
    const isLocationSearch = searchTerms.some((term) =>
      inputName.includes(term),
    );

    setIsDongSearch(isLocationSearch);
  }, [inputName]);

  //////////  검색어 강조 표시 시작  //////////
  // Utility function to highlight the search term
  const highlightSearchTerm = (fullText, searchTerm) => {
    if (!fullText || !searchTerm) return fullText; // null 체크

    const parts = fullText.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span
          key={index}
          style={{ color: "var(--Primary-500)", paddingRight: "0px" }}
        >
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  //////////  검색어 강조 표시 끝  //////////
  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.request({
  //       method: "get",
  //       url: `${MAIN_URL}/customers/name/${inputName}`,
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         "Content-Type": "application/json",
  //       },
  //       data: {
  //         name: inputName,
  //       },
  //     });
  //     if (response.status === 200) {
  //       setVisibleCustomers(response.data);
  //       setIsSearchMode(true); // Set search mode to true
  //       setInputName("");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customers by name:", error);
  //   }
  // };
  const handleSearch = async () => {
    try {
      let response;
      // const isDongSearch = inputName.includes("동"); // '동'을 포함하면 동 이름으로 간주

      if (isDongSearch) {
        // 동 이름으로 검색하는 경우
        response = await axios.get(
          `${MAIN_URL}/customers/dongName/${inputName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      } else {
        // 이름으로 검색하는 경우
        response = await axios.get(`${MAIN_URL}/customers/name/${inputName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }

      if (response.status === 200) {
        setVisibleCustomers(response.data);
        setIsSearchMode(true); // 검색 모드 활성화
        setSearchTerm(inputName); // 검색어 상태 업데이트
        setInputName("");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  //////////  이름 검색 로직 끝  //////////

  //////////  검색 모드 \\ 현 위치 검색 랜더링 로직 시작  //////////
  // Function to render a single customer item
  const renderCustomerItem = (customer, index) => (
    <div
      className="Map_customerList_item"
      key={index}
      onClick={() => handleCustomerClick(customer)}
      style={{
        backgroundColor:
          selectedCustomerPk === customer.pk ? "white" : "transparent",
        opacity: selectedCustomerPk === customer.pk ? 1 : 0.8,
        // paddingTop: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          // marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        <div className="inline-container-left">
          <p
            className="customer-info customer-type"
            style={{
              color: customerTypeColors[customer.customerType],
            }}
          >
            {customer.customerType}
          </p>
          <p className="customer-info customer-type">
            {" "}
            {isDongSearch
              ? customer.name
              : highlightSearchTerm(customer.name, searchTerm)}
          </p>
        </div>
        <div className="inline-container-right">
          <p className="customer-info font12">{customer.phone}</p>
          <p className="customer-info font12">
            {" "}
            {isDongSearch
              ? customer.dongString
              : highlightSearchTerm(customer.dongString, searchTerm)}
          </p>
        </div>
      </div>
      {/* <hr
    className="Map_list_hr"
    style={{
      width: "276px",
      margin: "0px 12px",
      // borderBottom: "0.5px solid #D0D0D0",
      borderBottom:
      selectedCustomerPk && selectedCustomerPk !== customer.pk
      ? "0.5px solid #999999"
      : "0.5px solid #D0D0D0",
      opacity:
      selectedCustomerPk && selectedCustomerPk !== customer.pk
      ? 0.4
      : 1,
    }}
  /> */}
    </div>
  );
  //////////  검색 모드 \\ 현 위치 검색 랜더링 로직 끝  //////////
  return (
    <div>
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
        resetSearch={() => {}} //메인컴포넌트 이외에는 그냥 에러만 발생하지 않도록 빈값 전달
      />
      <div class="flex flex-row pt-[76px]">
        {/* Main Content Container */}
        {isLoading && (
          <div className="map_spinner">
            <PropagateLoader color="#84CAFF" size={20} speedMultiplier={0.8} />
          </div>
        )}

        <div
          className="Map_customerList_container"
          style={{
            borderRight: isLoading ? "none" : "1px solid var(--gray-150)",
            width: "33%",
            height: "100vh",
            minWidth: "300px",
            backgroundColor: selectedCustomerPk ? "#999999" : "white",
            overflowY: "auto",
            zIndex: 2,
          }}
        >
          {!isLoading && (
            <>
              <div class=" z- z-30 mx-5 my-2 flex h-8  w-[89%] items-center  rounded  border border-Gray-scale-200 bg-white px-4 text-[10px] text-sm  font-light font-normal text-LightMode-Background">
                <img class="mr-5 h-6 w-6" src={search}></img>
                <input
                  type="name"
                  placeholder="검색하기"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onKeyDown={handleOnKeyDown} // Enter 입력 이벤트 함수
                  class="flex items-center text-LightMode-Text outline-none"
                ></input>
                {/* <div class="">새로고침</div> */}
              </div>
              <div class="my-2 mb-6 flex w-full justify-between px-6 text-[10px] font-normal text-LightMode-Text">
                <div class="cursor-default">현 위치 : {currentAddress}</div>
                {/* <div class="">새로고침</div> */}
              </div>
            </>
          )}
          {isSearchMode ? (
            visibleCustomers.map(renderCustomerItem)
          ) : hasVisibleCustomers ? (
            visibleCustomers.map(renderCustomerItem)
          ) : (
            <div class="flex h-[700px] items-center justify-center text-sm">
              {" "}
              현 위치에 해당하는 고객정보가 없습니다.
            </div>
          )}
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "91vh",
          }}
        >
          {/* Refresh Button */}
          {!isLoading && (
            <button
              className="Map_Search_Btn"
              style={{
                position: "absolute",
                bottom: "20px",
                paddingLeft: "50px",
                height: "33px",
                left: "50%", // Center horizontally
                transform: "translateX(-50%)", // Adjust for the button's width to center
                zIndex: 3, // Ensure it's above the map
              }}
              onClick={refreshCustomerList}
            >
              <img
                src={refresh}
                style={{
                  marginLeft: "-16px",
                  position: "absolute",
                }}
              />
              현 지도에서 검색
            </button>
          )}

          <div
            id="map"
            style={{
              width: "100%", // Use full width of the container
              height: "100%", // Use full height of the container
              position: "relative",
              zIndex: 1,
              // border: "1px solid #C9CAC9",
            }}
          ></div>
          {isDetailVisible && (
            <MapCustomerDetail
              customerPk={selectedCustomerPk}
              onClose={Map_customer_DetailClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
