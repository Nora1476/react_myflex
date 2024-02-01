import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { IGetTvsResult, getTvPopular } from "../api";
import { makeImagePath } from "../utils";

//슬라이더
const Slider = styled.div`
  margin-top: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;
const Row = styled(motion.div)`
  width: 95%;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const Btn = styled.button`
  height: 200px;
  border: none;
  color: white;
  position: absolute;
  z-index: 2;
  background: transparent;
  display: block;
  &:first-child {
    left: 0;
  }
  &:last-child {
    right: 0;
  }
`;
const Box = styled(motion.div)`
  width: 100%;
  background-color: white;
  height: 200px;
  cursor: pointer;
  font-size: 16px;
  color: black;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const offset = 6;
function TvRow2() {
  //Tv현재 방영중인 데이터 받아오는 query 함수
  const { data: popular, isLoading: popularLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "popular"], queryFn: getTvPopular });
  console.log(popular);

  //슬라이더 설정을 위한 세팅
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    setIndex((prev) => prev + 1);
  };
  return (
    <Slider>
      <AnimatePresence>
        <Row key={index}>
          {popular?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((tv) => (
              <Box
                //슬라이드 박스
                layoutId={tv.id + ""}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                key={tv.id}
              >
                <img src={makeImagePath(tv.backdrop_path || tv.poster_path, "w500")} alt="img" />
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default TvRow2;
