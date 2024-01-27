import { motion } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

const Svg = styled.svg`
  width: 506px;
  height: 360px;
  margin-bottom: 88px;
  path {
    stroke: var(--Secondary-300);
    stroke-width: 4;
    fill: none;
  }
`;

const svg = {
  start: { pathLength: 0 },
  end: {
    pathLength: 1,
    transition: { duration: 4 },
  },
};

function SvgAnimate() {
  const svgPath = process.env.PUBLIC_URL + "/2SectionLine.svg";

  return (
    <div class="flex h-screen items-center">
      {/* <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 452"> */}
      <Svg xmlns="http://www.w3.org/2000/svg">
        <motion.path
          variants={svg}
          initial="start"
          animate="end"
          viewport={{ once: false }}
          transition={
            {
              // default: { duration: 3 },
              // fill: { duration: 2, delay: 5 },
            }
          }
          d="M0 2L35.6827 37.122L52.5328 20.5366L80.286 90.2927L88.7111 77.6098H96.145H108.039L114.482 67.3659L127.367 90.2927L135.792 122L163.546 162.976L178.413 142H183.865L194.768 162.976L204.184 142L215.087 132.244L218.061 117.61L231.937 150.293L240.858 162.976L249.283 177.61L263.16 184.927L267.62 173.707L275.054 184.927L286.453 204.927L299.338 190.293L314.206 243.951L326.1 256.634L332.543 273.22L352.862 289.317L365.747 273.22L383.093 289.317L399.943 267.366L426.705 316.634L444.051 305.902L455.45 338.585L460.901 325.902L473.786 316.634L481.22 344.927L506 362"
          //   stroke="#4B5469"
          //   stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </div>
  );
}

export default SvgAnimate;
