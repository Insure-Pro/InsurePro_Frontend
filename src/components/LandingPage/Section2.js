import React, { useEffect, useRef } from "react";

const Section2 = () => {
  const sectionRef = useRef(null);

  const section2 = process.env.PUBLIC_URL + "/2Section.png";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return; // sectionRef.current가 null인 경우 함수 실행 중지
      const section = sectionRef.current;
      const sectionPosition = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionPosition < windowHeight * 0.6) {
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
          <div className="section2-subtitle">
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
          <div className="section2-subtitle">
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
          <div className="section2-subtitle">
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