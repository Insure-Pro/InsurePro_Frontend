import React, { useEffect, useRef } from "react";

const Section2 = () => {
  const sectionRef = useRef(null);

  const section2 = process.env.PUBLIC_URL + "/2Section.png";

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const sectionPosition = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionPosition < windowHeight * 0.9) {
        section.classList.add("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section ref={sectionRef} className="landing-section landing-section2 flex">
      <div class="w-1/2">
        <img src={section2} class="mt-[140px]" />
      </div>
      <div class="w-1/2">
        <div class=" mt-[90px] h-[476px] w-[433px]">
          <div class="flex h-9 text-[25px] font-extrabold text-white">
            여러분이 분배받는 DB의 퀄리티는
          </div>
          <div class="mb-11 flex h-9 text-[25px] font-extrabold text-white">
            점점 낮아지고 있습니다.
          </div>
          <div class="mb-12 flex h-[88px] w-[433px] items-center rounded bg-Secondary-300/60 px-2 py-4 text-[20px] font-bold text-LightMode-SectionBackground">
            {/* <div class="flex">
              <div class="pl-6 pr-3">•</div>
              <div>
                <div class="mb-2 flex">다른 지역 이동 시</div>
                <div> 함께 방문할 고객을 찾기 어렵습니다.</div>
              </div>
            </div> */}
            <div class="flex">
              <div class="pl-2 pr-2">•</div>
              <div>
                <div class="mb-2.5 flex">
                  개인정보를 알려주기 꺼려하는 사람은 늘어나고,
                </div>
                <div>리스트 목록에 오를 사람들은 한정되어 있습니다.</div>
              </div>
            </div>
          </div>
          <div class="mb-12 flex h-[88px] w-[433px] items-center rounded bg-Secondary-300/60 px-2 py-4 text-[20px] font-bold text-LightMode-SectionBackground">
            <div class="flex">
              <div class="pl-2 pr-2">•</div>
              <div>
                <div class="mb-2.5 flex">
                  DB 생산 업체는 어느 순간부터 신규유입이 적고
                </div>
                <div class="flex">중복고객이 많은 DB를 판배합니다.</div>
              </div>
            </div>
          </div>
          <div class="mb-12 flex h-[88px] w-[433px] items-center rounded bg-Secondary-300/60 px-2 py-4 text-[20px] font-bold text-LightMode-SectionBackground">
            <div class="flex">
              <div class="pl-2 pr-2">•</div>
              <div>
                <div class="mb-2.5 flex">이에 따라 DB의 퀄리티는 낮아지고,</div>
                <div> 자연스레 DB 구입대비 계약체결율은 낮아집니다.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section2;
