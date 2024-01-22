import React, { useEffect, useRef } from "react";

const Section3 = () => {
  const sectionRef = useRef(null);

  const Section3 = process.env.PUBLIC_URL + "/3Section.png";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || window.pageYOffset;

      // Calculate the visible ratio of the section
      let visibleTop = Math.max(sectionTop, scrollTop);
      let visibleBottom = Math.min(
        sectionTop + sectionHeight,
        scrollTop + windowHeight,
      );
      let visibleHeight = visibleBottom - visibleTop;

      let visibleRatio = Math.max(
        0,
        Math.min(1, visibleHeight / sectionHeight),
      );

      // Adjust the opacity based on the visible ratio
      section.style.opacity = visibleRatio;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section ref={sectionRef} className="section3 landing-section3">
      {/* <img src={Section3} class="w-full" /> */}
      <div class="h-[143px] text-[20px] font-extrabold">#2.</div>
      <div class="h-[86px]">
        <div className="section3-subtitle">계속되는 DB 구매 대신</div>
        <div className="section3-subtitle">
          충성고객을 확보해 고객을 확장해야 합니다.
        </div>
      </div>
    </section>
  );
};

export default Section3;
