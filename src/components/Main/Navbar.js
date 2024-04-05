import React, { useState, useEffect, useRef } from "react";
import "../../Navbar.css";
import axios from "axios";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { logoutSuccess } from "../../redux/authSlice";
import Search from "./Search";
import DateChangeAModal from "../Modal/DateChangeAModal";
import ManageCustomerTypesModal from "../Modal/ManageCustomerTypesModal";
import { toggleSearch } from "../../redux/searchSlice";
import { setSearchOff } from "../../redux/searchSlice";
import { setShowDateBar } from "../../redux/navbarSlice";
import { setCloseDateBar } from "../../redux/navbarSlice";
import { setCurrentTab } from "../../redux/tabsSlice";
import Swal from "sweetalert2";

const Navbar = ({
  onMonthCustomersClick,
  setCustomers,
  isLandingPage = false,
}) => {
  //----------------------------------------------------------------------
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Use a boolean to control the visibility of all submenus
  const [showSubMenus, setShowSubMenus] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width:960px)" });
  const search = process.env.PUBLIC_URL + "/search.png";
  const mypage = process.env.PUBLIC_URL + "/mypage.png";
  const navRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 960) {
        // Ensure submenus are not shown when resizing to mobile sizes
        setShowSubMenus(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();
  const menus = [
    {
      name: "고객목록",
      path: "/main", // 예시 경로, 실제 경로에 맞게 조정 필요
      subMenus: [
        { name: "전체", path: "/main" },
        { name: "월별고객", path: "/main" },
        { name: "계약완료", path: "/main" },
      ],
    },
    {
      name: "고객관리",
      path: "/", // 이 항목에 대한 기본 경로
      subMenus: [
        { name: "인근고객", path: "/kakaomap" },
        { name: "카톡발송", path: "/" },
        { name: "모바일 명함", path: "/" },
      ],
    },
    {
      name: "성과분석",
      path: "/analysis",
      subMenus: [],
    },
    {
      name: "회사소개",
      path: "/landingPage",
      subMenus: [],
    },
  ];

  //----------------------------------------------------------------------

  const [userName, setUserName] = useState("UserName");

  const dispatch = useDispatch();

  const location = useLocation();

  // 현재 경로가 /main인지 체크
  const isMainRoute = location.pathname === "/main";

  // Retrieve the login status from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const right_icon = process.env.PUBLIC_URL + "/arrow-right.png";
  const hamburger = process.env.PUBLIC_URL + "/hamburger.png";
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${MAIN_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          html:
            "<div style='text-align: left; font-size:16px;'>" +
            "로그아웃 되었습니다..<br><br>" +
            "</div>",
          // width: "700px",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
          position: "top", // Position the alert near the top of the screen
        });
        localStorage.removeItem("accessToken"); // Remove access token
        localStorage.removeItem("refreshToken"); // Remove refresh token
        dispatch(logoutSuccess()); // Dispatch logoutSuccess action
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed", error);
      if (error.response && error.response.data) {
        console.error("Error message:", error.response.data.message);
      }
    }
  };

  useEffect(() => {
    // 서버에서 직원 정보를 가져오는 함수
    const fetchEmployeeName = async () => {
      try {
        const response = await fetch(
          "https://www.insurepro.kro.kr/v1/employee",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setUserName(data.name); // 응답으로 받은 직원 이름을 상태 변수에 저장
      } catch (error) {
        console.error("Failed to fetch employee name:", error);
      }
    };

    fetchEmployeeName(); // 직원 정보를 가져오는 함수 호출
  }, []); // componentDidMount와 동일한 효과를 위해 빈 dependency 배열 사용

  const showSearch = useSelector((state) => state.search.showSearch);
  const showDateBar = useSelector((state) => state.navbar.showDateBar);

  const handleSearchToggle = () => {
    dispatch(toggleSearch());
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const formattedDateTitle = `${selectedYear}년 ${String(
    selectedMonth,
  ).padStart(2, "0")}월`; // formattedDate 업데이트

  const handleFormattedDateClick = () => {
    setIsModalOpen(true);
  };

  // 선택한 년, 월로 formattedDate를 업데이트하는 함수
  const handleDateChange = (newYear, newMonth, fetchedData) => {
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    setIsModalOpen(false); // Optionally, close the modal after changing the date
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}`;
    onMonthCustomersClick(formattedDate2);
  };

  // Handle the close action for the Search component
  const handleCloseSearch = () => {
    dispatch(setSearchOff()); // Dispatch setSearchOff action to hide the Search component
  };

  //로그인 상태에서 마이페이지 아이콘 클릭시 로그아웃 버튼
  const [showLogoutButton, setShowLogoutButton] = useState(false); // 로그아웃 버튼 표시 상태

  const logoutButtonRef = useRef(null); // 로그아웃 버튼 참조

  // 마이페이지 아이콘 클릭 핸들러 수정
  const handleMypageClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowLogoutButton(!showLogoutButton); // 로그아웃 버튼 토글
    }
  };

  // 외부 클릭 감지를 위한 이벤트 핸들러
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        logoutButtonRef.current &&
        !logoutButtonRef.current.contains(event.target)
      ) {
        setShowLogoutButton(false); // 외부 클릭 시 로그아웃 버튼 숨김
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [logoutButtonRef]);

  // 메뉴 클릭 시 해당 페이지로 이동
  const handleMenuClick = (name, path, event) => {
    event.preventDefault(); // 페이지 리로드 방지
    // 서브메뉴 클릭 시 상위 이벤트로의 전파를 막습니다.
    if (event) {
      event.stopPropagation();
    }
    if (name === "월별고객") {
      dispatch(setShowDateBar());
    } else {
      dispatch(setCloseDateBar());
    }
    dispatch(setCurrentTab(name)); // 클릭된 메뉴 이름을 현재 탭으로 설정
    navigate(path, { state: { selectedTab: name } });
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setShowLogoutButton(false);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {isMobile !== true ? (
        <header
          id="header"
          className={` ${
            isLandingPage ? "landing-page-navbar fixed " : "relative"
          }`}
        >
          <div className="container">
            <div className="row">
              <div className="header clearfix">
                <div
                  className={`logo ${!isMainRoute ? "ml-[-8px]" : ""}`}
                  onClick={() => {
                    dispatch(setCurrentTab("로고")); // '로고' 클릭 시 현재 탭을 '로고'로 설정
                    navigate("/main", { state: { selectedTab: "로고" } }); // 선택된 탭으로 상태 전달
                    dispatch(setCloseDateBar());
                  }}
                >
                  INSUREPRO
                </div>
                <nav
                  ref={navRef}
                  className={`gnb ${isMenuOpen ? "open" : ""}`}
                  onMouseLeave={() => setShowSubMenus(false)}
                >
                  <ul className="clearfix">
                    {menus.map((menu, index) => (
                      <li
                        key={index}
                        // Show all submenus on hover over any menu item
                        onMouseOver={() =>
                          windowWidth >= 960 && setShowSubMenus(true)
                        }
                        onClick={(e) => {
                          handleMenuClick(menu.name, menu.path, e);
                          setShowSubMenus(false);
                          windowWidth < 960 && setIsMenuOpen(!isMenuOpen);
                        }}
                      >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          {menu.name}
                        </a>
                        <ul
                          className={`submenu ${
                            showSubMenus && !isLandingPage ? "show" : "hide"
                          }`}
                        >
                          {menu.subMenus.map((subMenu, subIndex) => (
                            <li
                              key={subIndex}
                              onClick={(e) => {
                                handleMenuClick(subMenu.name, subMenu.path, e);
                                setShowSubMenus(false);
                              }}
                            >
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                {subMenu.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div class="flex flex-col">
                  <div
                    className={`icon-wrapper m-auto  flex h-[76px] w-[200px] items-center justify-center ${
                      isMainRoute ? "" : "pl-[20px]"
                    }  pt-2`}
                  >
                    {isMainRoute && isLoggedIn && (
                      <div class="mr-6 flex h-7 w-7 cursor-pointer items-center justify-center">
                        <img src={search} onClick={handleSearchToggle} />
                      </div>
                    )}
                    <div class="flex ">
                      <div class=" flex h-7 w-7  items-center justify-center">
                        <img
                          class="absoulte"
                          src={mypage}
                          onClick={handleMypageClick}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class={`right-2 h-[38px] w-[120px] ${
                      isMainRoute ? "" : "hidden"
                    }`}
                  >
                    {showLogoutButton && (
                      <>
                        <div
                          className={` ${
                            isMainRoute ? "left-20" : "left-16"
                          } relative bottom-2  z-10 flex h-[38px] w-[90px] items-center justify-center rounded border bg-white text-center text-sm font-semibold text-LightMode-Text hover:bg-LightMode-Hover`}
                          onClick={() => handleModalOpen()}
                        >
                          고객설정
                        </div>
                        <div
                          className={` ${
                            isMainRoute ? "left-20" : "left-16 "
                          } relative bottom-2  z-10 flex h-[38px] w-[90px] items-center justify-center rounded border bg-white text-center text-sm font-semibold text-LightMode-Text hover:bg-LightMode-Hover`}
                          onClick={handleLogout}
                        >
                          로그아웃
                        </div>
                        <div
                          className={` ${
                            isMainRoute ? "left-20" : "left-16"
                          } relative bottom-2  z-10 flex h-[38px] w-[90px] items-center justify-center rounded border bg-white text-center text-sm font-semibold text-LightMode-Text hover:bg-LightMode-Hover`}
                          onClick={() => navigate("/inquiry")}
                        >
                          문의하기
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div id="barMenu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <div className="bar"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="gnbBg"
            className={showSubMenus && !isLandingPage ? "show" : "hide"}
          ></div>
          {/* 조건부로 /main 경로에서만 Search컴포넌트 랜더링 되도록*/}
          {isMainRoute && showSearch && (
            <>
              {" "}
              <div class=" absolute z-10  flex h-[88px] w-full items-center justify-center bg-white">
                <Search
                  setCustomers={setCustomers}
                  onClose={handleCloseSearch}
                />
              </div>
              <div className="navbar-search-black-blur"></div>
            </>
          )}
          {showDateBar && (
            <div class=" relative z-[3] h-10 w-full bg-white  ">
              <div class="  m-auto   w-[1024px] px-12">
                <div class="flex  h-10  items-center justify-center  text-[17px] font-bold  text-LightMode-Text">
                  <div
                    onClick={handleFormattedDateClick}
                    class="w-[96px] cursor-pointer text-left"
                  >
                    {formattedDateTitle}
                  </div>
                  <img
                    onClick={handleFormattedDateClick}
                    class="cursor-pointer pl-1"
                    src={right_icon}
                  />
                  <div class="  h-full w-[782px]"></div>

                  {isModalOpen && (
                    <DateChangeAModal
                      initialYear={selectedYear}
                      initialMonth={selectedMonth}
                      onDateChange={handleDateChange}
                      onClose={() => setIsModalOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {showModal && (
            <ManageCustomerTypesModal
              show={handleModalOpen}
              close={handleModalClose}
            />
          )}
          {isModalOpen || showModal ? (
            <div className="blur-navbar-datechange"></div>
          ) : (
            ""
          )}
          <div
            className={`${showSubMenus ? "show" : "hide"} navbar-black-blur`}
          ></div>
        </header>
      ) : (
        <div class="flex h-[64px] w-full max-w-[960px] items-center justify-center">
          <div class="flex h-full w-[360px] items-center justify-center">
            <div className="hamburger">
              <img
                class="relative h-5 w-5"
                src={hamburger}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              <div
                class={`absolute left-0 top-[64px] ${
                  isMenuOpen ? "left-0" : "left-[-300px]"
                } flex h-screen w-1/3 max-w-[200px] flex-col bg-white text-LightMode-Subtext duration-100 ease-in-out`}
              >
                <div
                  class="relative mt-10 flex h-[60px] items-center justify-center border-y  border-y-Gray-scale-300"
                  onClick={() => {
                    dispatch(setCurrentTab("전체"));
                    navigate("/main", { state: { selectedTab: "전체" } });
                    // setIsMenuOpen(false);
                    setShowSubMenus(!showSubMenus);
                  }}
                >
                  고객목록
                </div>
                {showSubMenus && (
                  <div class=" text-xs">
                    <div
                      class="mr-3 h-[30px] "
                      onClick={() => {
                        dispatch(setCurrentTab("계약완료"));
                        navigate("/main", {
                          state: { selectedTab: "계약완료" },
                        });
                        setIsMenuOpen(false);
                      }}
                    >
                      계약완료
                    </div>
                    <div
                      class="mr-3 h-[30px] "
                      onClick={() => {
                        dispatch(setCurrentTab("월별고객"));
                        navigate("/main", {
                          state: { selectedTab: "월별고객" },
                        });
                        setIsMenuOpen(false);
                      }}
                    >
                      월별고객
                    </div>
                  </div>
                )}

                <div
                  class="flex h-[60px] items-center  justify-center border-y border-y-Gray-scale-300"
                  onClick={() => {
                    navigate("/kakaomap");
                  }}
                >
                  인근고객
                </div>
                <div
                  class=" flex h-[60px] items-center  justify-center border-b border-b-Gray-scale-300"
                  onClick={() => {
                    navigate("/analysis");
                  }}
                >
                  성과분석
                </div>
              </div>
            </div>
            <div
              className="ml-[90px] mr-[55px] text-[20px] font-semibold text-Primary-400"
              onClick={() => {
                dispatch(setCurrentTab("로고")); // '로고' 클릭 시 현재 탭을 '로고'로 설정
                navigate("/main", { state: { selectedTab: "로고" } }); // 선택된 탭으로 상태 전달
                dispatch(setCloseDateBar());
              }}
            >
              INSUREPRO
            </div>
            <div className="icon-wrapper">
              <div class="flex">
                <img src={search} class="mr-4" />
                <img src={mypage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
