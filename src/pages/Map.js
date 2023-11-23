import React, { useState, useEffect, useCallback, Suspense } from "react";

import {
  Container as MapDiv,
  NaverMap,
  useNavermaps,
  NavermapsProvider,
} from "react-naver-maps";
import Navbar from "../components/Navbar";

const MapComponent = () => {
  const navermaps = useNavermaps(); // `naver.maps` 객체를 가져옵니다.
  const [zoom, setZoom] = useState(13);

  const [draggable, setDraggable] = useState(true);
  const [disableKineticPan, setDisableKineticPan] = useState(true);
  const [tileTransition, setTileTransition] = useState(true);
  const [minZoom, setMinZoom] = useState(7);
  const [scaleControl, setScaleControl] = useState(true);

  const handleZoomChanged = useCallback((zoom) => {
    console.log(`zoom: ${zoom}`);
  }, []);

  const normalBtnStyle = {
    backgroundColor: "#fff",
    border: "solid 1px #333",
    outline: "0 none",
    borderRadius: "5px",
    boxShadow: "2px 2px 1px 1px rgba(0, 0, 0, 0.5)",
    margin: "0 5px 5px 0",
  };

  const selectedBtnStyle = {
    ...normalBtnStyle,
    backgroundColor: "#2780E3",
    color: "white",
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1000,
            padding: 5,
          }}
        >
          <button
            style={draggable ? selectedBtnStyle : normalBtnStyle}
            onClick={() => {
              setDraggable((prev) => !prev);
            }}
          >
            지도 인터렉션
          </button>
          <button
            style={!disableKineticPan ? selectedBtnStyle : normalBtnStyle}
            onClick={() => {
              setDisableKineticPan((prev) => !prev);
            }}
          >
            관성 드래깅
          </button>
          <button
            style={tileTransition ? selectedBtnStyle : normalBtnStyle}
            onClick={() => {
              setTileTransition((prev) => !prev);
            }}
          >
            타일 fadeIn 효과
          </button>
          <button
            style={scaleControl ? selectedBtnStyle : normalBtnStyle}
            onClick={() => {
              setScaleControl((prev) => !prev);
            }}
          >
            모든 지도 컨트롤
          </button>
          <button
            style={normalBtnStyle}
            onClick={() => {
              setMinZoom((prev) => (prev === 10 ? 7 : 10));
            }}
          >
            최소/최대 줌 레벨: {minZoom} ~ 21
          </button>
        </div>
        <NaverMap
          style={{
            // position: "absolute",

            left: 0,
            zIndex: 1000,
            padding: 5,
          }}
          zoomControl
          zoomControlOptions={{
            position: navermaps.Position.TOP_RIGHT,
          }}
          defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
          defaultZoom={13}
          onZoomChanged={handleZoomChanged}
          // 지도 인터랙션 옵션
          draggable={draggable}
          pinchZoom={draggable}
          scrollWheel={draggable}
          keyboardShortcuts={draggable}
          disableDoubleTapZoom={!draggable}
          disableDoubleClickZoom={!draggable}
          disableTwoFingerTapZoom={!draggable}
          // 관성 드래깅 옵션
          disableKineticPan={disableKineticPan}
          // 타일 fadeIn 효과
          tileTransition={tileTransition}
          // min/max 줌 레벨
          minZoom={minZoom}
          maxZoom={21}
          // 지도 컨트롤
          scaleControl={scaleControl}
          logoControl={scaleControl}
          mapDataControl={scaleControl}
          mapTypeControl={scaleControl}
          // zoomControl={scaleControl}
        >
          {/* 지도 위에 표시할 마커나 다른 요소를 추가할 수 있습니다. */}
        </NaverMap>
      </div>
    </div>
  );
};

const Map = () => {
  return (
    <NavermapsProvider
      ncpClientId="REACT_APP_MAP_ID"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <Navbar style={{ marginRight: "200px" }} />
      <MapDiv
        style={{
          width: "600px",
          height: "300px",

          marginLeft: "200px",
          marginTop: "100px",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <MapComponent />
        </Suspense>
      </MapDiv>
    </NavermapsProvider>
  );
};

export default Map;
