import React, { useEffect, useRef } from "react";

const Section7 = () => {
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
          #4.
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
            <div className="laptop-screen-7"></div>
          </div>
          <div class="ml-[42px] mt-[40px] flex flex-col text-left">
            <div class="mb-3 h-[17px] text-xs font-extrabold text-Primary-300 ">
              #맞춤정렬기능
            </div>
            <div class="mb-6 text-sm text-LightMode-Text">
              <div class="flex">
                •
                <div class="ml-2 flex h-[72px] flex-col">
                  <span class="h-6 w-[316px]">
                    본인이 구매한 고객 목록 중 어떤 유형에서
                  </span>
                  <span class="h-6 w-[316px]">
                    계약이 잘 체결되었는지, 진척도가 높은 지 확인
                  </span>
                  <span class="h-6 w-[316px]">할 수 있습니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section7;
