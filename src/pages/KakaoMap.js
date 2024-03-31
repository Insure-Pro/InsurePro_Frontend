/* global kakao */
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MapCustomerDetail from "../components/MapCustomerDetail";
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
  const markersRef = useRef([]); // 마커를 저장할 ref 생성
  const selectedMarkerRef = useRef(null); // 선택된 마커를 저장할 ref
  const [currentOpenOverlay, setCurrentOpenOverlay] = useState(null); //현 지도 검색 시 커스텀 오버레이 상태관리

  const marker_blue = process.env.PUBLIC_URL + "/marker_blue.png";
  const marker_red = process.env.PUBLIC_URL + "/marker_red.png";
  const marker_blue2 = process.env.PUBLIC_URL + "/marker_blue2.png";
  const marker_red2 = process.env.PUBLIC_URL + "/marker_red2.png";
  const search = process.env.PUBLIC_URL + "/search.png";
  const refresh = process.env.PUBLIC_URL + "/map_refresh.png";
  const check_on = process.env.PUBLIC_URL + "/check_on_8.png";
  const check_off = process.env.PUBLIC_URL + "/check_off_8.png";

  const [isLoading, setIsLoading] = useState(true);

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const [viewState, setViewState] = useState("list"); // 'list', 'detail', 'mapDetail' 중 하나의 상태를 갖습니다.

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

    const groupCustomersByLocation = (customers) => {
      const grouped = {};
      customers.forEach((customer) => {
        const key = customer.dongString; // Use dongString for grouping
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(customer);
      });
      return grouped;
    };

    let currentOpenOverlay = null; // This variable will track the currently open overlay
    let currentSelectedMarker = null; // Tracks the currently selected marker
    // Existing Axios request to fetch markers
    axios
      .get(`${MAIN_URL}/customers/latest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        // 고객 정보를 위치별로 그룹화
        const groupedCustomers = groupCustomersByLocation(response.data);

        Object.entries(groupedCustomers).forEach(
          ([dongString, customersGroup]) => {
            if (dongString && dongString.trim() !== "") {
              geocoder.addressSearch(dongString, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  setIsLoading(false);
                  const coords = new window.kakao.maps.LatLng(
                    result[0].y,
                    result[0].x,
                  );

                  // Create overlay content containing multiple customer information
                  let numberOfCustomers = customersGroup.length; // Determine the number of customers
                  let marginBottomValue =
                    numberOfCustomers > 1
                      ? (numberOfCustomers - 1) * 32 + 110
                      : 110; // Calculate marginBottom based on number of customers
                  //62 3개짜리 112 2개짜리 110 1개짜리

                  const markerImageBlue =
                    numberOfCustomers > 0
                      ? new window.kakao.maps.MarkerImage(
                          marker_blue2,
                          new window.kakao.maps.Size(21, 28),
                          { offset: new window.kakao.maps.Point(27, 69) },
                        )
                      : new window.kakao.maps.MarkerImage(
                          marker_blue,
                          new window.kakao.maps.Size(21, 28),
                          { offset: new window.kakao.maps.Point(27, 69) },
                        );

                  const markerImageRed =
                    numberOfCustomers > 0
                      ? new window.kakao.maps.MarkerImage(
                          marker_red2,
                          new window.kakao.maps.Size(21, 28),
                          { offset: new window.kakao.maps.Point(27, 69) },
                        )
                      : new window.kakao.maps.MarkerImage(
                          marker_red,
                          new window.kakao.maps.Size(21, 28),
                          { offset: new window.kakao.maps.Point(27, 69) },
                        );

                  // 여러 고객 정보를 포함하는 오버레이 내용 생성
                  let content = `<div class="custom-overlay" style="margin-top: -${marginBottomValue}px;"  >`;
                  customersGroup.forEach((customer, index) => {
                    // 첫 번째 아이템에만 'active' 클래스 추가, 나머지는 'inactive'
                    const itemClass = index === 0 ? "active" : "inactive";
                    content += `<div class='custom-overlay-items ${itemClass}' data-pk='${customer.pk}'><span style="margin-right: 8px;">${customer.customerType}</span><span>${customer.name}</span></div><hr>`;
                  });
                  content += `</div>`;

                  // 위치에 해당하는 마커 생성
                  const marker = new window.kakao.maps.Marker({
                    position: coords,
                    image: markerImageBlue, // 기본 마커 이미지 설정
                  });
                  // 생성된 마커를 지도에 추가
                  marker.setMap(mapRef.current);

                  // This approach stores the entire customer group in the marker for later use
                  marker.customersGroup = customersGroup; // Attach the customers data to the marker

                  // setMarkers((prevMarkers) => [...prevMarkers, marker]);
                  markersRef.current = [...markersRef.current, marker];
                  marker.setTitle(String(customersGroup.pk));

                  window.kakao.maps.event.addListener(
                    marker,
                    "click",
                    function () {
                      // 모든 마커의 이미지를 초기화    // If there's a previously selected marker, reset its image to blue
                      // Reset the image of any previously selected marker
                      if (selectedMarkerRef.current) {
                        const prevNumberOfCustomers =
                          selectedMarkerRef.current.customersGroup.length;
                        const prevMarkerImage =
                          prevNumberOfCustomers > 0
                            ? marker_blue2
                            : marker_blue;
                        selectedMarkerRef.current.setImage(
                          new window.kakao.maps.MarkerImage(
                            prevMarkerImage,
                            new window.kakao.maps.Size(21, 28),
                            { offset: new window.kakao.maps.Point(27, 69) },
                          ),
                        );
                      }

                      // Determine the number of customers associated with the clicked marker
                      const numberOfCustomers = marker.customersGroup.length;
                      const clickedMarkerImage =
                        numberOfCustomers > 0 ? marker_red2 : marker_red;

                      // Set the clicked marker's image
                      marker.setImage(
                        new window.kakao.maps.MarkerImage(
                          clickedMarkerImage,
                          new window.kakao.maps.Size(21, 28),
                          { offset: new window.kakao.maps.Point(27, 69) },
                        ),
                      );

                      // Update the selectedMarker reference
                      selectedMarkerRef.current = marker; // 현재 마커를 선택된 마커로 저장
                      //마커 클릭 시 MapCustomerDetail 컴포넌트 보이도록
                      if (marker.customersGroup.length > 0) {
                        setSelectedCustomerPk(marker.customersGroup[0].pk); // Example: Use the first customer's PK
                        setIsDetailVisible(true);
                        setViewState("mapDetail"); // 마커 클릭 시 viewState를 mapDetail로 설정
                        setCurrentOpenOverlay(customOverlay); //현 지도 검색 클릭 시 커스텀 오버레이 닫기 위함
                      }
                      // Logic to display MapCustomerDetail based on the selected marker
                      // For simplicity, just showing the first customer's PK as an example

                      const overlayItems = document.querySelectorAll(
                        ".custom-overlay-items",
                      );
                      overlayItems.forEach((item) => {
                        item.classList.add("inactive");
                        item.classList.remove("active");
                      });

                      // 첫 번째 오버레이 아이템만 활성화
                      if (overlayItems.length > 0) {
                        overlayItems[0].classList.add("active");
                        overlayItems[0].classList.remove("inactive");
                      }
                      if (currentSelectedMarker === marker) {
                        // Toggle marker and overlay for the same marker
                        if (currentOpenOverlay) {
                          currentOpenOverlay.setMap(null);
                          currentOpenOverlay = null;
                          marker.setImage(markerImageBlue);
                          currentSelectedMarker = null;
                        } else {
                          customOverlay.setMap(mapRef.current);
                          currentOpenOverlay = customOverlay;
                          marker.setImage(markerImageRed);
                          currentSelectedMarker = marker;
                        }
                      } else {
                        // Change to a new marker
                        if (currentOpenOverlay) {
                          currentOpenOverlay.setMap(null);
                        }
                        if (currentSelectedMarker) {
                          currentSelectedMarker.setImage(markerImageBlue);
                        }
                        customOverlay.setMap(mapRef.current);
                        currentOpenOverlay = customOverlay;
                        marker.setImage(markerImageRed);
                        currentSelectedMarker = marker;
                      }
                    },
                  );

                  const customOverlay = new window.kakao.maps.CustomOverlay({
                    content: content,
                    position: coords,
                    xAnchor: 0.65,
                    yAnchor: 3.4, // Adjust this to position the tooltip above the marker
                    zIndex: 3,
                  });
                  // 고객 수가 2명 이상일 경우, CustomOverlay로 고객 수 표시
                  if (numberOfCustomers > 0) {
                    const content = `<div style="color: white; width:30px; height:13px; display:flex; cursor: pointer; justify-content:center; text-align: center; font-size: 12px; font-weight: bold;">${numberOfCustomers}</div>`;
                    const customOverlay = new window.kakao.maps.CustomOverlay({
                      content: content,
                      position: coords,
                      xAnchor: 1.07,
                      yAnchor: 5, // 마커 위에 표시되도록 조정
                      zIndex: 4,
                    });
                    customOverlay.setMap(mapRef.current);
                    // 마커에 커스텀 오버레이 참조 저장
                    marker.customOverlay = customOverlay;

                    // 커스텀 오버레이의 컨텐츠에 직접 접근하여 클릭 이벤트 리스너 추가
                    const overlayElement = customOverlay.a; // a는 CustomOverlay의 내부 DOM 요소를 참조하는 프로퍼티입니다. API 버전에 따라 다를 수 있습니다.
                    overlayElement.addEventListener("click", function () {
                      // 여기에 클릭 이벤트가 발생했을 때 실행할 로직을 추가
                      // 예: 마커 클릭 이벤트 트리거, 특정 함수 호출 등
                      window.kakao.maps.event.trigger(marker, "click");
                    });
                  }

                  // 클러스터에 마커 추가
                  clusterer.addMarker(marker);
                  // 클러스터 클릭 이벤트 리스너 내에서 커스텀 오버레이 숨기기 로직은 제거
                  // 이유: 클러스터를 클릭했을 때 이미 클러스터링되어 있으므로,
                  // 여기서는 클러스터링 발생 시 마커의 오버레이를 숨기는 것이 목표임

                  // Adding an event listener to the map container for delegation
                  document.getElementById("map").addEventListener(
                    "click",
                    function (e) {
                      let targetElement = e.target.closest(
                        ".custom-overlay-items",
                      );

                      if (targetElement) {
                        const pk = targetElement.getAttribute("data-pk");
                        if (pk) {
                          setSelectedCustomerPk(pk); // Set the selected customer's PK
                          setIsDetailVisible(true); // Show the detail component for the selected customer

                          // Clear styles for all items
                          document
                            .querySelectorAll(".custom-overlay-items")
                            .forEach((item) => {
                              item.classList.add("inactive");
                              item.classList.remove("active");
                            });

                          // 클릭된 항목만 활성화
                          targetElement.classList.add("active");
                          targetElement.classList.remove("inactive");
                        }
                      }
                    },
                    true,
                  ); // Using capture phase for this example

                  // Add event listeners to show/hide the tooltip
                  // window.kakao.maps.event.addListener(
                  //   marker,
                  //   "mouseover",
                  //   function () {
                  //     marker.setImage(markerImageRed);
                  //     customOverlay.setMap(mapRef.current);
                  //   },
                  // );

                  // window.kakao.maps.event.addListener(
                  //   marker,
                  //   "mouseout",
                  //   function () {
                  //     customOverlay.setMap(null);
                  // marker.setImage(markerImageBlue);
                  //   },
                  // );

                  clusterer.addMarker(marker); // Add each marker to clusterer
                } else if (
                  status === window.kakao.maps.services.Status.ZERO_RESULT
                ) {
                  // Log the dongString that could not be found
                  console.log(
                    `Address not found: ${customersGroup.dongString}`,
                  );
                } else {
                  console.error(
                    `Geocode was not successful for the following reason: ${status}`,
                  );
                }
              });
            }
          },
        );
        // After markers are added, call refreshCustomerList to populate the list
        refreshCustomerList();
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
    setIsLoading(false);

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
    const marker = markersRef.current.find(
      (m) =>
        m.customersGroup && m.customersGroup.some((c) => c.pk === customer.pk),
    );
    console.log(marker);

    if (marker) {
      mapRef.current.panTo(marker.getPosition());

      const numberOfCustomers = marker.customersGroup.length;
      const markerImageBlue =
        numberOfCustomers > 0 ? marker_blue2 : marker_blue;
      const markerImageRed = numberOfCustomers > 0 ? marker_red2 : marker_red;

      // Deselect if the same customer is clicked again
      if (selectedMarkerRef.current === marker) {
        // Toggle off, set all markersRef.current to blue
        marker.setImage(
          new window.kakao.maps.MarkerImage(
            markerImageBlue, // Assuming marker_blue is the URL or path to the blue marker image
            new window.kakao.maps.Size(21, 28),
            { offset: new window.kakao.maps.Point(27, 69) },
          ),
        );
        setSelectedCustomerPk(null);
        selectedMarkerRef.current = null; // 선택 해제
        setIsDetailVisible(false); // Optionally close detail view
      } else {
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.setImage(
            new window.kakao.maps.MarkerImage(
              markerImageBlue,
              new window.kakao.maps.Size(21, 28),
              { offset: new window.kakao.maps.Point(27, 69) },
            ),
          );
        }

        // Select new marker, set to red
        marker.setImage(
          new window.kakao.maps.MarkerImage(
            markerImageRed, // Assuming marker_red is the URL or path to the red marker image
            new window.kakao.maps.Size(21, 28),
            { offset: new window.kakao.maps.Point(27, 69) },
          ),
        );
        setSelectedCustomerPk(customer.pk); // Select new
        selectedMarkerRef.current = marker; // 마커 선택
        setIsDetailVisible(true); // Optionally open detail view
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

      // Initialize all markersRef.current to a blue marker
      // 모든 마커를 기본적으로 파란색으로 초기화하고, 고객 수에 따라 이미지 변경
      markersRef.current.forEach((marker) => {
        const numberOfCustomers = marker.customersGroup
          ? marker.customersGroup.length
          : 0;
        const appropriateMarkerImage =
          numberOfCustomers > 0 ? marker_blue2 : marker_blue;

        marker.setImage(
          new window.kakao.maps.MarkerImage(
            appropriateMarkerImage, // 고객 수에 따라 선택된 이미지
            new window.kakao.maps.Size(21, 28),
            { offset: new window.kakao.maps.Point(27, 69) },
          ),
        );
      });
      //커스텀 오버레이 초기화
      if (currentOpenOverlay) {
        currentOpenOverlay.setMap(null);
        setCurrentOpenOverlay(null); // 오버레이 상태를 null로 초기화
      }

      // Update the state based on whether there are visible customers
      setHasVisibleCustomers(filteredCustomers.length > 0);
      setVisibleCustomers(filteredCustomers);
      setIsSearchMode(false); // 검색모드 초기화
      setIsDetailVisible(false); //상세정보 보기 초기화
      setSelectedCustomerPk(null); // 고객 선택된 상태 초기화
    }
    setViewState("list"); // 현 지도에서 검색 시 viewState를 list로 설정
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
  // useEffect(() => {
  //   // 컴포넌트가 마운트된 후에 실행되는 코드
  //   const mapContainer = document.getElementById("map");
  //   if (mapContainer) {
  //     const handleMapClick = function (e) {
  //       // 여기에 이벤트 처리 로직 추가
  //       let targetElement = e.target.closest(".custom-overlay-items");
  //       if (targetElement) {
  //         const pk = targetElement.getAttribute("data-pk");
  //         if (pk) {
  //           setSelectedCustomerPk(pk);
  //           setIsDetailVisible(true);
  //           // 여기에 클릭된 요소에 대한 추가 처리 로직을 추가할 수 있습니다.
  //         }
  //       }
  //     };
  //     mapContainer.addEventListener("click", handleMapClick, true); // 이벤트 리스너 추가

  //     return () => {
  //       // 컴포넌트가 언마운트될 때 실행되는 클린업 코드
  //       mapContainer.removeEventListener("click", handleMapClick, true); // 이벤트 리스너 제거
  //     };
  //   }
  // }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행됩니다.
  useEffect(() => {
    // 이벤트 리스너를 추가하기 전에 'map' 요소가 존재하는지 확인
    const mapElement = document.getElementById("map");
    if (!mapElement) return; // 'map' 요소가 없으면 여기서 종료

    const handleClick = (e) => {
      let targetElement = e.target.closest(".custom-overlay-items");
      // 여기에 클릭 이벤트에 대한 로직 추가
    };

    // 'map' 요소에 클릭 이벤트 리스너 추가
    mapElement.addEventListener("click", handleClick, true);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      mapElement.removeEventListener("click", handleClick, true);
    };
  }, []); // 의존성 배열이 비어있으면 컴포넌트 마운트 시에만 실행됩니다.

  //////////  검색 모드 \\ 현 위치 검색 랜더링 로직 시작  //////////

  // Function to render a single customer item
  const renderCustomerItem = (customer, index) => {
    const isSelected = customer.pk === selectedCustomerPk;
    const itemBackgroundColor = customer.contractYn
      ? "var(--LightMode-SectionBackground)"
      : "white";
    // const overlayStyle = isSelected
    //   ? {}
    //   : { backgroundColor: "rgba(0, 0, 0, 0.4)" };

    return (
      <div
        className="Map_customerList_item"
        key={index}
        onClick={() => handleCustomerClick(customer)}
        style={{
          backgroundColor: itemBackgroundColor,
          zIndex: isSelected ? 3 : 1,
          position: "relative",
        }}
      >
        <div class="flex cursor-pointer">
          <div className="inline-container-left">
            <p
              className="customer-info customer-type text-center"
              style={{
                color: customerTypeColors[customer.customerType],
              }}
            >
              {customer.customerType}
            </p>
            <p className="customer-info customer-type text-center">
              {" "}
              {isDongSearch
                ? customer.name
                : highlightSearchTerm(customer.name, searchTerm)}
            </p>
            <img
              src={customer.contractYn ? check_on : check_off}
              class="pb-0.5"
            />
          </div>
          <div className="inline-container-right">
            <p className="customer-info font12 text-left">{customer.phone}</p>
            <p className="customer-info font12 text-left">
              {" "}
              {isDongSearch
                ? customer.dongString
                : highlightSearchTerm(customer.dongString, searchTerm)}
            </p>
          </div>
        </div>
        {!isSelected && selectedCustomerPk && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "300px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 2, // This ensures the overlay is on top of non-selected items
            }}
          ></div>
        )}
      </div>
    );
  };
  //////////  검색 모드 \\ 현 위치 검색 랜더링 로직 끝  //////////
  return (
    <div>
      <Navbar />
      <div class="flex flex-row">
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
            width: "300px",
            height: "95vh",
            // minWidth: "300px",
            // overflowY: isSearchMode
            //   ? "auto"
            //   : hasVisibleCustomers
            //     ? "auto"
            //     : "hidden",
            position: "relative",
          }}
        >
          {!isLoading && viewState === "list" ? (
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
              </div>
              <div class="my-2 mb-6 flex w-full justify-between px-6 text-[10px] font-normal text-LightMode-Text">
                <div class="cursor-default">현 위치 : {currentAddress}</div>
              </div>
            </>
          ) : (
            <MapCustomerDetail
              customerPk={selectedCustomerPk}
              onClose={Map_customer_DetailClose}
            />
          )}
          {isSearchMode ? (
            visibleCustomers.map(renderCustomerItem)
          ) : hasVisibleCustomers ? (
            visibleCustomers.map(renderCustomerItem)
          ) : (
            <div class="mt-[320px] flex h-full justify-center overflow-hidden text-sm">
              {" "}
              현 위치에 해당하는 고객정보가 없습니다.
            </div>
          )}
          {selectedCustomerPk && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 0, // Overlay behind the selected item
              }}
            ></div>
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
              zIndex: 0,
            }}
          ></div>
          {isDetailVisible && viewState === "list" ? (
            <MapCustomerDetail
              customerPk={selectedCustomerPk}
              onClose={Map_customer_DetailClose}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
