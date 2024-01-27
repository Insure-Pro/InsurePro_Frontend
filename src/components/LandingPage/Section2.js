import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SvgAnimate from "./SvgAnimate";

const Section2 = () => {
  const sectionRef = useRef(null);

  // const section2 = process.env.PUBLIC_URL + "/2Section.png";
  const section2 = process.env.PUBLIC_URL + "/2Section.png";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return; // sectionRef.current가 null인 경우 함수 실행 중지
      const section = sectionRef.current;
      const sectionPosition = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionPosition < windowHeight * 0.7) {
        section.classList.add("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        ease: "easeInOut",
        duration: 1.8,
        y: { duration: 0.8 },
      }}
    >
      <section
        ref={sectionRef}
        className="landing-section landing-section2 flex"
      >
        <div class="w-1/2">
          <SvgAnimate />
          {/* <img src={section2} class="mt-[140px]" /> */}
        </div>
        <div class="w-1/2">
          <div class=" mt-[90px] h-[476px] w-[433px]">
            <div class="flex h-9 text-[25px] font-extrabold text-white">
              여러분이 분배받는 DB의 퀄리티는
            </div>
            <div class="mb-11 flex h-9 text-[25px] font-extrabold text-white">
              점점 낮아지고 있습니다.
            </div>
            <motion.div
              className="section2-subtitle  bg-Secondary-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.7, duration: 1.1 }}
            >
              <div class="flex">
                <div class="pl-2 pr-2">•</div>
                <div>
                  <div class="mb-2.5 flex">
                    개인정보를 알려주기 꺼려하는 사람은 늘어나고,
                  </div>
                  <div>리스트 목록에 오를 사람들은 한정되어 있습니다.</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="section2-subtitle bg-Secondary-600"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 1.2, duration: 1.1 }}
            >
              <div class="flex">
                <div class="pl-2 pr-2">•</div>
                <div>
                  <div class="mb-2.5 flex">
                    DB 생산 업체는 어느 순간부터 신규유입이 적고
                  </div>
                  <div class="flex">중복고객이 많은 DB를 판매합니다.</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="section2-subtitle bg-Secondary-700"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 1.7, duration: 1.1 }}
            >
              <div class="flex">
                <div class="pl-2 pr-2">•</div>
                <div>
                  <div class="mb-2.5 flex">
                    이에 따라 DB의 퀄리티는 낮아지고,
                  </div>
                  <div> 자연스레 DB 구입대비 계약체결율은 낮아집니다.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Section2;
