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
const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${(props) => props.$bgPhoto});
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
  width: 100%;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  /* position: absolute; */
`;
const Btn = styled.button`
  border: none;
  background: transparent;
  color: white;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  width: 100%;
  background-color: white;
  height: 200px;
  cursor: pointer;
  font-size: 16px;
  color: black;
  background: url(${(props) => props.$bgPhoto}) center center/cover;
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
  entry: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  }),
};

const offset = 6;

function Tv() {
  //Tv현재 방영중인 데이터 받아오는 query 함수
  const { data: airing, isLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "airing_today"], queryFn: getTvShows });

  //빠르게 여러번 동작할때 슬라이더 겹치지 않게 설정
  const [leaving, setLeaving] = useState(false);

  const [index, setIndex] = useState(0); //row의 key값으로 동작하여 새로운 row로 인식하도록 설정
  const [isBack, setIsBack] = useState(false); // prev, next 버튼 구분

  const totalMovie = (airing?.results.length as number) - 1; //배너로 사용한 영화1개는 제외
  const maxIndex = Math.floor(totalMovie / offset) - 1;
  const prevPlz = () => {
    console.log("클릭", leaving, index);
    if (airing) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const nextPlz = () => {
    console.log("클릭", leaving, index);
    if (leaving) return; //슬라이드 처음 시작일 경우 false 값으로  아래 동작 실행
    toggleLeaving();
    setIsBack(false); //슬라이드 다음 버튼 모션동작 컨트롤
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const toggleLeaving = () => {
    console.log(leaving);
    setLeaving((prev) => !prev);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner $bgPhoto={makeImagePath(airing?.results[0].backdrop_path || "")}>
            <Title>{airing?.results[0].name}</Title>
            <OverView>{airing?.results[0].overview}</OverView>
          </Banner>

          <Slider>
            <AnimatePresence initial={false} custom={isBack} onExitComplete={toggleLeaving}>
              <Btn onClick={prevPlz} key={index + 2}>
                prev
              </Btn>
              <Row
                //
                custom={isBack}
                variants={rowVariants}
                initial="entry"
                animate="visible"
                exit="exit"
                transition={{ type: "tween" }}
                key={index}
              >
                {airing?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box key={movie.id} $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}></Box>
                  ))}
              </Row>
              <Btn onClick={nextPlz} key={index + 1}>
                next
              </Btn>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
