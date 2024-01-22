import React, { useEffect, useRef } from "react";

const Section4 = () => {
  const sectionRef = useRef(null);

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
    <section ref={sectionRef} className=" landing-section4 flex-col">
      <div class="flex flex-col text-[25px] font-extrabold">
        <div class="flex h-9">
          <div className="logo">InsurePro</div>
          <p>는</p>
        </div>
        <div class="flex h-9">
          보험설계사분들이 지속적인 고객관리, 신규고객 창출 과정에서
        </div>
        <div class="flex h-9">다음과 같은 어려움을 분석했습니다.</div>
      </div>
      <div>
        <div>
          <div class="section4_box  animate__animated animate__fadeInLeft mt-[56px] h-[184px]">
            <div class="flex">
              <div class="pl-6 pr-3">•</div>
              <div>원하는 고객 정보를 바로 보기 어렵습니다.</div>
            </div>
            <div class="my-8 flex flex-col">
              <span class="mb-2 ">"고객정보를 수기로 기록하여</span>
              <span class="mb-2">지역별, 나이대별, 고객유형별 등</span>
              <span>원하는 고객정보만을 보기 어려워요."</span>
            </div>
          </div>
          <div class="section4_box animate__animated animate__fadeInRight  h-[184px]">
            <div class="flex">
              <div class="pl-6 pr-3">•</div>
              <div>고객 DB 구매에 대한 활동 분석이 어렵습니다.</div>
            </div>
            <div class="my-8 flex flex-col">
              <span class="mb-2">"고객 DB 구매 시</span>
              <span class="mb-2">
                본인이 어떤 DB 유형에서 계약이 잘 체결되었는지,
              </span>
              <span>클로징으로 많이 이어지는지 파악하기 어려워요.”</span>
            </div>
          </div>
          <div class="section4_box animate__animated animate__fadeInLeft h-[156px]">
            <div class="flex">
              <div class="pl-6 pr-3">•</div>
              <div>관리 고객에 대한 문서화가 어렵습니다.</div>
            </div>
            <div class="my-8 flex flex-col">
              <span class="mb-2">
                "매월 가망고객, 기고객 리스트 정리가 필요해요.
              </span>
              <span>한 곳에 일일이 옮기는 작업이 굉장히 번거로워요."</span>
            </div>
          </div>
          <div class="section4_box animate__animated animate__fadeInRight  h-[212px]">
            <div class="flex">
              <div class="pl-6 pr-3">•</div>
              <div>
                <div class="mb-2 flex">다른 지역 이동 시</div>
                <div> 함께 방문할 고객을 찾기 어렵습니다.</div>
              </div>
            </div>
            <div class="my-8 flex flex-col">
              <span class="mb-2">"장거리 출장 시,</span>
              <span class="mb-2">해당 지역에 방문한 김에</span>
              <span>계약한 고객을 만나 관리하고 싶어요.”</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;
