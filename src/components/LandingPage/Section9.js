import React, { useEffect, useRef } from "react";

const Section9 = () => {
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
    <section
      ref={sectionRef}
      className="landing-section landing-section9 flex-col"
    >
      <div class="mb-[72px] h-[158px]">
        {/* InsurePro<p>는</p>
        <div>
          카톡 / 문자 단체 발송기능 <p>을 개발 중에 있습니다.</p>
        </div> */}
      </div>
      <div class="mb-[80px]  flex justify-center text-LightMode-Text">
        <div class="h-[143px] text-[20px] font-extrabold">#6.</div>
        <div>
          <div class="mb-3 h-[45px] w-[456px] text-[30px] font-black">
            합리적인 요금제.
          </div>
          {/* <div class="h-[43px] w-[456px] text-[30px] font-extrabold">
            응앵애응애 좋아
          </div> */}
        </div>
      </div>
      <div class="flex md:mx-[42px] lg:mx-auto ">
        <div className=" section9-card-container ">
          <div class="section9-card-title mb-[48px] ">무료체험</div>
          <div className="section9-card-price-wrapper mb-[62px] ">
            <p className="section9-card-price">1</p>
            개월
          </div>
          <div className=" section9-card-content-wrapper mb-[10px] h-[68px]">
            <span>
              InsurePro는<span class="bg-Primary-400/30">1 개월 무료 체험</span>{" "}
            </span>
            <span>이벤트를 지원하고 있습니다.</span>
            <span>체험 후, 사용을 고민해보세요!</span>
          </div>
          <button className="section9-card-btn">
            회원가입하고 무료체험 사용하기
          </button>
        </div>
        <div className="section9-card-container ml-[20px]">
          <div class="section9-card-title mb-[48px] ">추가할인</div>
          <div className="section9-card-price-wrapper mb-[69px] ">
            <p className="section9-card-price">1</p>
            개월
          </div>
          <div className="section9-card-content-wrapper mb-[37px] h-[34px]">
            <span>기업 제휴 시</span>
            <span>
              <span class="bg-Primary-400/30">추가할인</span>을 제공하고
              있습니다.
            </span>
          </div>
          <button className="section9-card-btn">기업 추가할인 문의하기</button>
        </div>
        <div className="section9-card-container ml-[20px]">
          <div class="section9-card-title mb-[36px] ">1개월 이용권</div>
          <span className="section9-card-rawPrice">25,000</span>
          <div className="section9-card-price-wrapper mb-[62px] ">
            <p className="section9-card-price">15,000</p>
            원/월
          </div>
          <div className="section9-card-content-wrapper mb-[23px] h-[34px]">
            <span>
              <span class="bg-Primary-400/30">Open Event</span>가격으로, 1개월
              이용권을
            </span>
            <span>저렴하게 구매하실 수 있습니다.</span>
            <span class=" mt-4 h-[11px] text-[8px] font-bold text-LightMode-Text">
              *Open Event: 2024-01-15 ~ 2024-03-15 진행
            </span>
          </div>
          <button className="section9-card-btn mt-5">
            Open Event가격으로 이용권 구독하기
          </button>
        </div>
        <div className="section9-card-container ml-[20px]">
          <div class="section9-card-title mb-[36px] ">6개월 이용권</div>
          <span className="section9-card-rawPrice">150,000</span>
          <div className="section9-card-price-wrapper mb-[52px] ">
            <p className="section9-card-price">99,000</p>
            원/월
          </div>
          <div className="section9-card-content-wrapper mb-[20px] h-[68px]">
            <span class="mb-0.5">
              <span class=" bg-Primary-400/30">Open Event</span>
            </span>
            <span>
              <span class="bg-Primary-400/30">
                + 6개월 이용권 할인 Event(-34%)
              </span>
            </span>
            <span>으로 최적의 가격으로</span>
            <span>서비스를 이용하실 수 있습니다.</span>
          </div>
          <button className="section9-card-btn">
            최적의 가격으로 이용권 구독하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section9;
