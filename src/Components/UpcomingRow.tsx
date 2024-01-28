import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";

//슬라이더
const Slider = styled.div`
  margin-top: 140px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;
const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

function UpcomingRow() {
  //슬라이더 설정을 위한 세팅
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    setIndex((prev) => prev + 1);
  };
  return (
    <Slider>
      <AnimatePresence>
        <Row key={index}>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default UpcomingRow;
