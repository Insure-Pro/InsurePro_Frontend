import React, { useEffect, useRef } from "react";

const Section5 = ({ currentSection, changeSection }) => {
  const sectionRef = useRef(null);

  const section5 = process.env.PUBLIC_URL + "/5Section.png";

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const sectionPosition = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionPosition < windowHeight * 0.5) {
        section.classList.add("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section ref={sectionRef} className="landing-section landing-section5">
      {/* {renderSection(5)} */}
      <div className="circle-container">
        {[6, 7, 8].map((sectionNumber) => (
          <div
            key={sectionNumber}
            className={`circle ${
              currentSection === sectionNumber ? "active" : ""
            }`}
            onClick={() => changeSection(sectionNumber)}
            // style={{
            //   width: "50px",
            //   height: "50px",
            //   borderRadius: "50%",
            //   backgroundColor:
            //     currentSection === sectionNumber
            //       ? "var(--Primary-300)"
            //       : "white",
            // }}
          />
        ))}
      </div>
    </section>
  );
};

export default Section5;
