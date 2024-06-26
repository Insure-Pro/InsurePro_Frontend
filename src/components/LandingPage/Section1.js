import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "../../pages/LandingPage/LandingPage.css";

const Section1 = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // State to control visibility

  const arrow = process.env.PUBLIC_URL + "/landing-arrow56fff.png";

  useEffect(() => {
    // Set a timeout to change the visibility state
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 700); // Delay of 1 second

    return () => clearTimeout(timer);
  }, []);

  const arrowVariants = {
    animate: {
      y: ["0px", "8px", "0px"],
      opacity: [0, 0.8, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2.2,
          ease: "easeInOut",
        },
        opacity: {
          repeat: Infinity,
          duration: 2.2,
          ease: "easeInOut",
        },
      },
    },
  };

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
      className={` landing-section1  mt-[-76px] ${isVisible ? "visible" : ""}`}
    >
      <motion.div
        initial={{ opacity: 0.2, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{
          ease: "easeInOut",
          duration: 1.8,
          y: { duration: 0.8 },
        }}
        class="mt-[136px] flex"
      >
        <div class=" h-[143px] text-[20px] font-extrabold">#1.</div>
        <div>
          <div class="mb-3 h-[45px] w-[470px] text-[30px] font-black">
            고객관리, 고객창출.
          </div>
          <div className="section1-subtitle">
            나에게 너무 먼 얘기로만 취급한다면,
          </div>
          <div className="section1-subtitle">
            고객 DB지출은 점점 커져갈 것입니다.
          </div>
          <div class="mr-16 mt-[150px] flex justify-center bg-transparent">
            <motion.img
              src={arrow}
              variants={arrowVariants}
              animate="animate"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Section1;
