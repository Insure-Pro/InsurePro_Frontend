import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ".././LandingPage/LandingPage.css";
import Navbar from "../../components/Main/Navbar/Navbar";
import Section1 from "../../components/LandingPage/Section1";
import Section2 from "../../components/LandingPage/Section2";
import Section3 from "../../components/LandingPage/Section3";
import Section4 from "../../components/LandingPage/Section4";
import Section5 from "../../components/LandingPage/Section5";
import Section6 from "../../components/LandingPage/Section6";
import Section7 from "../../components/LandingPage/Section7";
import Section8 from "../../components/LandingPage/Section8";
import Section9 from "../../components/LandingPage/Section9";

const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState(6);
  const [visibleSections, setVisibleSections] = useState([6]);

  const navigate = useNavigate();

  const section5Ref = useRef(null); // 섹션 5에 대한 ref 생성

  const [isFirstTransition, setIsFirstTransition] = useState(true); // 첫 번째 전환 추적을 위한 상태 변수

  useEffect(() => {
    const checkSection5Visibility = () => {
      const section = section5Ref.current;
      if (section && section instanceof HTMLElement) {
        const sectionBounds = section.getBoundingClientRect();
        return (
          sectionBounds.top >= 0 && sectionBounds.bottom <= window.innerHeight
        );
      }
      return false;
    };

    // 4초마다 섹션 전환
    const interval = setInterval(
      () => {
        if (checkSection5Visibility()) {
          setCurrentSection((prevSection) => {
            const nextSection = prevSection === 8 ? 6 : prevSection + 1;

            // 첫 번째 전환 처리
            if (isFirstTransition && prevSection === 6 && nextSection === 7) {
              // 섹션 7을 먼저 활성화
              if (!visibleSections.includes(nextSection)) {
                setVisibleSections((prevVisible) => [
                  ...prevVisible,
                  nextSection,
                ]);
              }
              setTimeout(() => {
                setVisibleSections((prevVisible) => [
                  ...prevVisible,
                  nextSection,
                ]);
                setIsFirstTransition(false); // 첫 번째 전환 후 상태 변경
              }, 1500); // 1.5초 후 전환
              return nextSection;
            }

            // 섹션 5를 항상 보이도록 처리
            if (nextSection !== 5 && visibleSections.includes(5)) {
              setVisibleSections(
                visibleSections.filter((section) => section !== 5),
              );
            }
            if (!visibleSections.includes(nextSection)) {
              setVisibleSections((prevVisible) => [
                ...prevVisible,
                nextSection,
              ]);
            }
            return nextSection;
          });
        }
      },
      isFirstTransition && currentSection === 6 ? 1200 : 3200, // 첫 번째 전환 여부와 현재 섹션에 따라 지연 시간 변경
    );

    return () => clearInterval(interval);
  }, [visibleSections, currentSection, isFirstTransition]); // currentSection 의존성 추가

  const changeSection = (sectionNumber) => {
    setCurrentSection(sectionNumber);
    if (!visibleSections.includes(sectionNumber)) {
      setVisibleSections((prevVisible) => [...prevVisible, sectionNumber]);
    }
  };
  const renderSection = (sectionNumber) => {
    switch (sectionNumber) {
      case 5:
        return (
          <Section5
            currentSection={currentSection}
            changeSection={changeSection}
          />
        );
      case 6:
        return <Section6 />;
      case 7:
        return <Section7 />;
      case 8:
        return <Section8 />;
      default:
        return null;
    }
  };

  return (
    <div class=" w-screen">
      <Navbar isLandingPage={true} />
      <div class="pt-[76px]"></div>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      {/* ... other sections */}
      <div ref={section5Ref} className="sections-container">
        {/* 섹션 5 */}
        {renderSection(5)}
        {/* 섹션 6, 7, 8 */}
        {[6, 7, 8].map((sectionNumber) => (
          <section
            key={sectionNumber}
            className={`landing-section landing-section${sectionNumber} ${
              visibleSections.includes(sectionNumber) ? "visible" : ""
            }`}
            style={{ transform: `translateX(-${(currentSection - 6) * 100}%)` }}
          >
            {renderSection(sectionNumber)}
          </section>
        ))}
      </div>
      {/* <Section9 /> */}
    </div>
  );
};

export default LandingPage;
