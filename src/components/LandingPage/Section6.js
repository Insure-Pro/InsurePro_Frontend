import React, { useEffect, useRef } from "react";

const Section6 = () => {
  const sectionRef = useRef(null);

  const section6 = process.env.PUBLIC_URL + "/6Section.png";

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
          #3.
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
          <div className="laptop-container-6">
            <div className="laptop-screen-6"></div>
          </div>
          <div class="ml-[42px] mt-[70px] flex flex-col text-left">
            <div className="section678-highlight">#맞춤정렬기능</div>
            <div class="mb-6  text-base text-LightMode-Text ">
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
            <div class="mb-6 text-base text-LightMode-Text">
              <div class="flex">
                •
                <div class="ml-2 flex flex-col">
                  <span className="section678-span ">
                    원하는 조건에 따라 정렬된
                  </span>
                  <span className="section678-span">
                    고객 리스트를 쉽게 엑셀 문서화할 수 있습니다.
                  </span>
                </div>
              </div>
            </div>
            <div class=" text-base text-LightMode-Text">
              <div class="flex">
                •
                <div class="ml-2 flex h-[86px] flex-col">
                  <span className="section678-span">
                    이제까지 쌓아온 고객 정보를
                  </span>
                  <span className="section678-span">
                    엑셀로 한 번에 손쉽게 추가해보세요.
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

export default Section6;
