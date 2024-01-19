import React, { useEffect, useRef } from "react";
import "../../LandingPage.css";

const Section1 = () => {
  const sectionRef = useRef(null);

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
    <section
      ref={sectionRef}
      className="landing-section landing-section1  pb-[76px]"
    >
      <div class="h-[143px] text-[20px] font-extrabold">#1.</div>
      <div>
        <div class="mb-3 h-[45px] w-[456px] text-[30px] font-black">
          고객관리, 고객창출.
        </div>
        <div class="h-[43px] w-[456px] text-[30px] font-extrabold">
          나에게 너무 먼 얘기로만 취급한다면,
        </div>
        <div class="h-[43px] w-[456px] text-[30px] font-extrabold">
          고객 DB지출은 점점 커져갈 것입니다.
        </div>
      </div>
    </section>
  );
};

export default Section1;
