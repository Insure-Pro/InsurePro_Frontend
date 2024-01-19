import React, { useEffect, useRef } from "react";

const Section3 = () => {
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
    <section ref={sectionRef} className="landing-section landing-section3">
      <div class="h-[143px] text-[20px] font-extrabold">#2.</div>
      <div class="h-[86px]">
        <div class="h-[43px] w-[622px] text-[30px] font-extrabold">
          계속되는 DB 구매 대신
        </div>
        <div class="h-[43px] w-[622px] text-[30px] font-extrabold">
          충성고객을 확보해 고객을 확장해야 합니다.
        </div>
      </div>
    </section>
  );
};

export default Section3;
