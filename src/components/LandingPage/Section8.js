import React, { useEffect, useRef } from "react";

const Section8 = () => {
  const sectionRef = useRef(null);

  const section7 = process.env.PUBLIC_URL + "/7Section.png";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return; // sectionRef.current가 null인 경우 함수 실행 중지
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
    <section ref={sectionRef} className="landing-section landing-section6">
      <div class="flex flex-col pl-[56px] pt-[70px]">
        <div class="flex h-[143px] text-[20px] font-extrabold">
          #5.
          <div class="ml-10 h-[86px]">
            <div className="section678-title">
              지속적인 고객관리, 신규고객창출의 부담감.
            </div>
            <div className="section678-subtitle">
              <p className="logo">InsurePro</p>의 솔루션으로 해결할 수 있습니다.
            </div>
          </div>
        </div>
        <div class="ml-[52px] flex">
          <div className="laptop-container-78">
            <div className="laptop-screen-8"></div>
          </div>
          <div class="ml-[42px] mt-[70px] flex flex-col text-left">
            <div className="section678-highlight mt-[70px]">#맞춤정렬기능</div>
            <div class="mb-6  text-sm text-LightMode-Text">
              <div class="flex">
                •
                <div class="ml-2 flex h-[72px] flex-col">
                  <span className="section678-span">
                    고객을 등록하고, 고객과의 일정을 입력하세요.
                  </span>
                  <span className="section678-span">
                    여러분이 찾아보길 원하는 지역별, 나이대별,
                  </span>
                  <span className="section678-span">
                    고객유형별로 원하는 고객만을 볼 수 있습니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8;
