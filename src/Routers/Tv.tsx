import { useQuery } from "@tanstack/react-query";
import { IGetTvsDetail, IGetTvsResult, getTvOnair, getTvPopular, getTvShows, tvShowDetail } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
  flex-direction: column;
  gap: 40px;
`;
const Slider_row = styled.div`
  display: flex;
  position: relative;
`;
const Row = styled(motion.div)`
  width: 95%;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin: 0 auto;
  /* position: absolute;
  left: 0;
  right: 0; */
`;
const Btn = styled(motion.button)`
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
const Info = styled(motion.div)`
  padding: 10px;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  z-index: 10;
`;
const BigTv = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) !important;
  margin: 0 auto;
  z-index: 99;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;
  flex-direction: column;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 38px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigDetail = styled.div`
  padding: 20px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  div {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  h4 {
    font-size: 18px;
    white-space: nowrap;
  }
  ul {
    display: flex;
    li {
      white-space: nowrap;
    }
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
//박스 Row내 박스 hover시 동작설정
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
//박스내 hover시 같이뜨는 정보 동작설정
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Tv() {
  //Tv현재 방영중인 데이터 받아오는 query 함수
  const { data: airing, isLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "airing_today"], queryFn: getTvShows });
  const { data: popular, isLoading: popularLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "popular"], queryFn: getTvPopular });
  const { data: onair, isLoading: onairLoading } = useQuery<IGetTvsResult>({ queryKey: ["tv", "on_the_air"], queryFn: getTvOnair });

  //빠르게 여러번 동작할때 슬라이더 겹치지 않게 설정
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false); // prev, next 버튼 구분
  const [index, setIndex] = useState(0); //row의 key값으로 동작하여 새로운 row로 인식하도록 설정
  const [indexRow2, setIndexRow2] = useState(0); //row의 key값으로 동작하여 새로운 row로 인식하도록 설정
  const [indexRow3, setIndexRow3] = useState(0); //row의 key값으로 동작하여 새로운 row로 인식하도록 설정

  const totalMovie = (airing?.results.length as number) - 1; //배너로 사용한 영화1개는 제외
  const maxIndex = Math.floor(totalMovie / offset) - 1;

  const prevRow1 = () => {
    if (airing) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const prevRow2 = () => {
    console.log("클릭", leaving, index);
    if (popular) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndexRow2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const prevRow3 = () => {
    console.log("클릭", leaving, index);
    if (onair) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndexRow3((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const nextRow1 = () => {
    if (leaving) return; //슬라이드 처음 시작일 경우 false 값으로  아래 동작 실행
    toggleLeaving();
    setIsBack(false); //슬라이드 다음 버튼 모션동작 컨트롤
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const nextRow2 = () => {
    if (leaving) return; //슬라이드 처음 시작일 경우 false 값으로  아래 동작 실행
    toggleLeaving();
    setIsBack(false); //슬라이드 다음 버튼 모션동작 컨트롤
    setIndexRow2((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const nextRow3 = () => {
    if (leaving) return; //슬라이드 처음 시작일 경우 false 값으로  아래 동작 실행
    toggleLeaving();
    setIsBack(false); //슬라이드 다음 버튼 모션동작 컨트롤
    setIndexRow3((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const toggleLeaving = () => {
    console.log(leaving);
    setLeaving((prev) => !prev);
  };

  //박스 클릭시 모달창 띄움
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId");
  const { data: detail, isLoading: detailLoading } = useQuery<IGetTvsDetail>({
    queryKey: ["tv", bigTvMatch?.params.tvId],
    queryFn: () => tvShowDetail(bigTvMatch?.params.tvId + ""),
    enabled: !!bigTvMatch,
  });
  // console.log(detail);

  //Row 슬라이드에 movie 클릭이 상세페이지 정보 params으로 url내 tvId와 일치하는 nowMovie를 가져옴
  // const clickedMovie = bigTvMatch?.params.tvId && airing?.results.find((tv) => String(tv.id) === bigTvMatch.params.tvId);
  //Row 슬라이드에 movie를 클릭하면 해당링크로 이동(상세페이지)  및 영화 디테일정보 불러오기
  const onBoxClicked = (tvId: string) => {
    navigate(`/tv/${tvId}`);
  };
  //오버레이부분 클릭시 홈링크로 이동 (상세페이지 모달끄는 용도)
  const onOverlayclick = () => {
    navigate(`/tv`);
  };

  const NEXFLIX_LOGO_URL = "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

  return (
    <Wrapper>
      {isLoading && popularLoading && onairLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner $bgPhoto={makeImagePath(airing?.results[0].backdrop_path || "")}>
            <Title>{airing?.results[0].name}</Title>
            <OverView>{airing?.results[0].overview}</OverView>
          </Banner>

          <Slider>
            <Slider_row>
              <Btn onClick={prevRow1}>prev</Btn>
              <AnimatePresence initial={false} custom={isBack} onExitComplete={toggleLeaving}>
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
                    .map((tv) => (
                      <Box
                        //슬라이드 박스
                        variants={boxVariants}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        key={tv.id}
                        onClick={() => onBoxClicked(tv.id + "")}
                      >
                        <img src={tv.backdrop_path ? makeImagePath(tv.backdrop_path || tv.poster_path, "w500") : NEXFLIX_LOGO_URL} alt="img" />
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <Btn onClick={nextRow1}>next</Btn>
            </Slider_row>

            <Slider_row>
              <Btn onClick={prevRow2}>prev</Btn>
              <AnimatePresence initial={false} custom={isBack} onExitComplete={toggleLeaving}>
                <Row
                  //
                  custom={isBack}
                  variants={rowVariants}
                  initial="entry"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween" }}
                  key={indexRow2}
                >
                  {popular?.results
                    .slice(1)
                    .slice(offset * indexRow2, offset * indexRow2 + offset)
                    .map((tv) => (
                      <Box
                        //
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(tv.id + "")}
                      >
                        <img src={tv.backdrop_path ? makeImagePath(tv.backdrop_path || tv.poster_path, "w500") : NEXFLIX_LOGO_URL} alt="img" />
                        <Info variants={infoVariants}>
                          {/* 부모로부터 hover */}
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <Btn onClick={nextRow2}>next</Btn>
            </Slider_row>

            <Slider_row>
              <Btn onClick={prevRow3}>prev</Btn>
              <AnimatePresence initial={false} custom={isBack} onExitComplete={toggleLeaving}>
                <Row
                  //
                  custom={isBack}
                  variants={rowVariants}
                  initial="entry"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween" }}
                  key={indexRow3}
                >
                  {onair?.results
                    .slice(1)
                    .slice(offset * indexRow3, offset * indexRow3 + offset)
                    .map((tv) => (
                      <Box
                        //
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(tv.id + "")}
                      >
                        <img src={tv.backdrop_path ? makeImagePath(tv.backdrop_path || tv.poster_path, "w500") : NEXFLIX_LOGO_URL} alt="img" />
                        <Info variants={infoVariants}>
                          {/* 부모로부터 hover */}
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <Btn onClick={nextRow3}>next</Btn>
            </Slider_row>
          </Slider>

          {/* modal */}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay onClick={onOverlayclick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                {/* 모달창 */}
                {detailLoading ? (
                  <>Loading...</>
                ) : (
                  <BigTv>
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${
                            detail?.backdrop_path ? makeImagePath(detail.backdrop_path || detail.poster_path, "w500") : NEXFLIX_LOGO_URL
                          })`,
                        }}
                      />

                      <BigTitle>{detail?.name}</BigTitle>
                      <BigOverview>{detail?.overview}</BigOverview>
                      <BigDetail>
                        <div>
                          <h4>Type : &nbsp; </h4>
                          <span>{detail?.type}</span>
                        </div>
                        <div>
                          <h4>Genres : &nbsp;</h4>
                          <ul>
                            {detail?.genres.map((i, index) => (
                              <li key={index}>{i.name}&nbsp;/</li>
                            ))}
                          </ul>
                        </div>
                      </BigDetail>
                    </>
                  </BigTv>
                )}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
