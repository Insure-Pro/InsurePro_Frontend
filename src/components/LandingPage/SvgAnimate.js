import { motion } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

const Svg = styled.svg`
  width: 558px;
  height: 392px;
  path {
    stroke: var(--Secondary-400);
    stroke-width: 2;
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
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 452">
        <motion.path
          variants={svg}
          initial="start"
          animate="end"
          transition={{
            default: { duration: 3 },
            // fill: { duration: 2, delay: 5 },
          }}
          d="M485 373.692L478.111 393.753L471.222 382.608L461.578 346.945L456.067 364.777L450.556 353.632L439.533 364.777L434.022 342.488L420.244 320.198L407.844 326.885L402.333 293.451L389.933 257.788L378.911 293.451L373.4 284.535L367.889 302.367L361 277.849L340.333 248.873L334.822 277.849L325.178 242.186L312.778 226.583L304.511 242.186L300.378 199.836L293.489 219.897L281.089 199.836L272.822 210.981V177.547L259.044 166.402L250.778 210.981L241.133 193.15V219.897L225.978 199.836L217.711 242.186L206.689 257.788L198.422 242.186L188.778 186.463L180.511 219.897L175 186.463L158.467 210.981V186.463L150.2 166.402V199.836L136.422 242.186L132.289 210.981L129.533 184.234L125.4 199.836L115.756 166.402L108.867 184.234L100.6 237.728L90.9556 226.583L82.6889 199.836L74.4222 210.981L67.5333 184.234L55.1333 177.547V128.511L44.1111 121.824V95.0768L26.2 106.221L22.0667 54.9561L11.0444 32.6669V63.8718L4.15555 95.0768H-2.73337L-11 28.209L-19.2667 63.8718L-24.7778 48.2694L-33.0445 43.8115L-38.5555 17.0644L-48.2 32.6669L-50.2667 22.6367L-63.3555 1.46191L-73 43.8115"
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