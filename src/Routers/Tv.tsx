import { useQuery } from "@tanstack/react-query";
import { IGetTvsResult, getTvShows } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  background: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  width: 60%;
  font-size: 68px;
  margin-bottom: 20px;
`;
const OverView = styled.p`
  font-size: 28px;
  width: 50%;
`;

//슬라이더
const Slider = styled.div`
  position: relative;
  top: -100px;
  display: flex;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Btn = styled.button`
  border: none;
  background: transparent;
  position: absolute;
  z-index: 2;
  &:first-child {
    left: 0;
  }
  &:last-child {
    right: 0;
  }
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
const Info = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

//Row 슬라이드시 너비 설정
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

function Tv() {
  //Tv현재 방영중인 데이터 받아오는 query 함수
  const { data: airing, isLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "airing_today"], queryFn: getTvShows });
  console.log(airing, isLoading);

  const [index, setIndex] = useState(0);
  const increseIndex = () => setIndex((prev) => prev + 1);
  console.log(index);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(airing?.results[0].backdrop_path || "")}>
            <Title>{airing?.results[0].name}</Title>
            <OverView>{airing?.results[0].overview}</OverView>
          </Banner>

          <Slider>
            <Btn onClick={increseIndex}>prev</Btn>
            <AnimatePresence>
              <Row
                //
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                key={index}
              >
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
              </Row>
            </AnimatePresence>
            <Btn onClick={increseIndex}>next</Btn>
          </Slider>

          <Slider>
            <Btn onClick={increseIndex}>prev</Btn>
            <AnimatePresence>
              <Row
                //
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                key={index}
              >
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
              </Row>
            </AnimatePresence>
            <Btn onClick={increseIndex}>next</Btn>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
