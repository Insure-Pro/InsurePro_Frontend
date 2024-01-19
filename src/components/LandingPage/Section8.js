import React, { useEffect, useRef } from "react";

const Section8 = () => {
  const sectionRef = useRef(null);

  const section7 = process.env.PUBLIC_URL + "/7Section.png";

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
    <section ref={sectionRef} className="landing-section landing-section6">
      <div class="flex flex-col pl-[56px] pt-[70px]">
        <div class="flex h-[143px] text-[20px] font-extrabold">
          #5.
          <div class="ml-10 h-[86px]">
            <div class="mb-2 flex h-[43px] w-[622px] text-[30px] font-extrabold">
              지속적인 고객관리, 신규고객창출의 부담감.
            </div>
            <div class="flex h-[43px] w-[622px] text-[25px] font-bold">
              <p className="logo">InsurePro</p>의 솔루션으로 해결할 수 있습니다.
            </div>
          </div>
        </div>
        <div class="ml-[52px] flex">
          <div className="laptop-container-78">
            <div className="laptop-screen-8"></div>
          </div>
          <div class="ml-[42px] mt-[70px] flex flex-col text-left">
            <div class="mb-3 mt-[70px] h-[17px] text-xs font-extrabold text-Primary-300">
              #맞춤정렬기능
            </div>
            <div class="mb-6  text-sm text-LightMode-Text">
              <div class="flex">
                •
                <div class="ml-2 flex h-[72px] flex-col">
                  <span class="h-6 w-[316px] list-disc">
                    고객을 등록하고, 고객과의 일정을 입력하세요.
                  </span>
                  <span class="h-6 w-[316px]">
                    여러분이 찾아보길 원하는 지역별, 나이대별,
                  </span>
                  <span class="h-6 w-[316px]">
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
