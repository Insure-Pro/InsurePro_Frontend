import React, { useState, useEffect, useRef } from "react";
import "../LandingPage.css"; // Add styling for your landing pagesimport '.'
import Navbar from "../components/Navbar";
import Section1 from "../components/LandingPage/Section1";
import Section2 from "../components/LandingPage/Section2";
import Section3 from "../components/LandingPage/Section3";
import Section4 from "../components/LandingPage/Section4";
import Section5 from "../components/LandingPage/Section5";
import Section6 from "../components/LandingPage/Section6";
import Section7 from "../components/LandingPage/Section7";
import Section8 from "../components/LandingPage/Section8";
import Section9 from "../components/LandingPage/Section9";

const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState(6);
  const [visibleSections, setVisibleSections] = useState([6]);

  const section5Ref = useRef(null); // 섹션 5에 대한 ref 생성

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

    // 6초마다 섹션 전환
    const interval = setInterval(() => {
      if (checkSection5Visibility()) {
        setCurrentSection((prevSection) => {
          const nextSection = prevSection === 8 ? 6 : prevSection + 1;
          // 섹션 5를 항상 보이도록 처리
          if (nextSection !== 5 && visibleSections.includes(5)) {
            setVisibleSections(
              visibleSections.filter((section) => section !== 5),
            );
          }
          if (!visibleSections.includes(nextSection)) {
            setVisibleSections((prevVisible) => [...prevVisible, nextSection]);
          }
          return nextSection;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleSections, currentSection]); // currentSection 의존성 추가

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
      <Navbar />
      <div class="pt-[76px]"></div>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
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
      <Section9 />
    </div>
  );
};

export default LandingPage;
