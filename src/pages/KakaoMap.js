import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import axios from "axios";

const KakaoMap = () => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  const [mapCenter, setMapCenter] = useState({
    lat: 35.1379222, // Default latitude (Busan City Hall)
    lng: 129.05562775, // Default longitude (Busan City Hall)
  });
  const [locationObtained, setLocationObtained] = useState(false);
  const [markers, setMarkers] = useState([]); // New state for storing marker objects

  const createCurrentLocationCircle = (map, position) => {
    new window.kakao.maps.Circle({
      map: map,
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
    const map = new window.kakao.maps.Map(container, options);
    const geocoder = new window.kakao.maps.services.Geocoder();
    // New: Initialize marker clusterer
    clusterer = new window.kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5,
      disableClickZoom: true,
    });

    // Existing Axios request to fetch markers
    axios
      .get(`${MAIN_URL}/customers/latest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        response.data.forEach((customer) => {
          geocoder.addressSearch(customer.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );
              const marker = new window.kakao.maps.Marker({ position: coords });
              clusterer.addMarker(marker); // Add each marker to clusterer
            } else {
              console.error(
                `Geocode was not successful for the following reason: ${status}`
              );
            }
          });
        });
      })
      .catch((error) => console.log(error));

    // New: Add event listener for cluster click
    window.kakao.maps.event.addListener(
      clusterer,
      "clusterclick",
      (cluster) => {
        const level = map.getLevel() - 1;
        map.setLevel(level, { anchor: cluster.getCenter() });
      }
    );

    if (locationObtained) {
      createCurrentLocationCircle(map, mapCenter);
    }
  };

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

  useEffect(() => {
    if (locationObtained) {
      window.kakao.maps.load(initializeMap);
    }
  }, [locationObtained, mapCenter]);

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
