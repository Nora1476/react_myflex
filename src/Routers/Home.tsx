import { useQuery } from "@tanstack/react-query";
import { IGeRatedMoviesResult, IGetMovieDetail, IGetMoviesResult, getMovies, movieDetail, upcomingMovies, topRatedMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
//AnimatePresence 컴포넌트가 render되거나 destroy 될 때 효과를 줄 수 있음
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

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
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${(props) => props.$bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 24px;
  width: 50%;
  line-height: 1.4;
`;
//슬라이더
const Slider = styled.div`
  position: relative;
  top: -100px;
  display: flex;
  flex-direction: column;
  gap: 80px;
  h3 {
    margin-bottom: -70px;
  }
`;
const SubTitle = styled.h3`
  font-size: 30px;
  margin-bottom: -30px;
  padding: 0 30px;
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
  right: 0;
  left: 0; */
`;
const Btn = styled(motion.button)`
  height: 200px;
  border: none;
  color: white;
  position: absolute;
  z-index: 2;
  display: block;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  &:first-child {
    left: 0;
  }
  &:last-child {
    right: 0;
  }
  span {
    scale: 1.2;
  }
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background: url(${(props) => props.$bgPhoto}) center center / cover;
  height: 200px;
  font-size: 66px;
  border-radius: 5px;
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
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    text-align: center;
    font-size: 16px;
  }
  &:hover {
    color: white;
  }
  span {
    &:hover::before {
      content: "상세정보";
      font-size: 12px;
      position: absolute;
      top: -20px;
      right: -5px;
      padding: 6px 10px;
      border-radius: 4px;
      color: ${(props) => props.theme.black.darker};
      background-color: ${(props) => props.theme.white.lighter};
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
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
  justify-content: space-between;
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
  top: -100px;
`;
const BigOverview = styled.div`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  h4 {
    font-size: 20px;
    margin-bottom: 20px;
  }
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
  }
  ul {
    display: flex;
  }
`;

//Row 슬라이드시 너비 설정
const rowVariants = {
  entry: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
    opacity: 0,
    transition: {
      duration: 1,
    },
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.5,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
    opacity: 0,
    transition: {
      duration: 1,
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
const btnVariants = {
  hover: {
    opacity: 1,
    scaleX: 1.2,
    transition: {
      delay: 0.5,
      duaration: 0.5,
      type: "spring",
    },
  },
};

const offset = 6;
function Home() {
  // useQuery(키값지정, 데이터불러오는함수)
  const { data: nowMovie, isLoading: nowLoading } = useQuery<IGetMoviesResult>({ queryKey: ["movie", "nowPlaying"], queryFn: getMovies });
  const { data: topRated, isLoading: topLoading } = useQuery<IGeRatedMoviesResult>({ queryKey: ["movie", "top_rated"], queryFn: topRatedMovies });
  const { data: upcoming, isLoading: upcomingLoading } = useQuery<IGeRatedMoviesResult>({ queryKey: ["movie", "popular"], queryFn: upcomingMovies });

  const [leaving, setLeaving] = useState(false); //빠르게 여러번 동작할때 슬라이더 겹치지 않게 설정
  const [isBack, setIsBack] = useState(false); // prev, next 버튼 구분
  const [index, setIndex] = useState(0); //row의 key값으로 동작하여 새로운 row로 인식하도록 설정
  const [indexRow2, setIndexRow2] = useState(0);
  const [indexRow3, setIndexRow3] = useState(0);

  const totalMovie = (nowMovie?.results.length as number) - 1; //배너로 사용한 영화1개는 제외
  const maxIndex = Math.floor(totalMovie / offset) - 1;

  const prevRow1 = () => {
    if (nowMovie) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const prevRow2 = () => {
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      setIsBack(true);
      setIndexRow2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const prevRow3 = () => {
    if (upcoming) {
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
    setLeaving((prev) => !prev);
  };

  //박스 클릭시 모달창 띄움
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const { data: detail, isLoading: detailLoading } = useQuery<IGetMovieDetail>({
    //
    queryKey: ["movie", bigMovieMatch?.params.movieId],
    queryFn: () => movieDetail(bigMovieMatch?.params.movieId + ""),
    enabled: !!bigMovieMatch,
  });
  console.log(detail);

  // console.log(bigMovieMatch);
  //Row 슬라이드에 movie를 클릭하면 해당링크로 이동(상세페이지)
  const onBoxClicked = (movieId: string) => {
    navigate(`/movies/${movieId}`);
  };
  //오버레이부분 클릭시 홈링크로 이동 (상세페이지 모달끄는 용도)
  const onOverlayclick = () => {
    navigate(`${process.env.PUBLIC_URL}/`);
  };

  //overview 글자수 제한
  const content = () => {
    if (detail?.overview === "") return "no summary";
    else if ((detail?.overview as string).length > 250) return detail?.overview.slice(0, 350) + "...";
    else return detail?.overview;
  };

  const NEXFLIX_LOGO_URL = "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

  return (
    <Wrapper>
      {nowLoading && topLoading && upcomingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            //motion.div 설정시 props $bgPhoto를 string으로 받을 수있는 type을 설정해둔 상태
            $bgPhoto={makeImagePath(nowMovie?.results[0].backdrop_path || "")}
          >
            {/* 1. 베너 클릭할때 setIndex가 1씩 더해지면서 key 값을 인덱스를 늘려주어 새로운 Row생성효과  */}
            <Title>{nowMovie?.results[0].title}</Title>
            <OverView>{nowMovie?.results[0].overview}</OverView>
          </Banner>

          <Slider>
            <>
              <SubTitle> 현재상영작 </SubTitle>
              <Slider_row>
                {/* initial 이 false 일 경우 컴포넌트가 처음 마운트될때 오른쪽에서 들어오는 효과 없어짐 
                  3. Row에 설정된 exit모션이 끝났을때 toggleLeaving동작하며 index + 1효과 */}
                <Btn variants={btnVariants} whileHover="hover" onClick={prevRow1}>
                  <span className="material-symbols-outlined">arrow_back_ios</span>
                </Btn>
                <AnimatePresence initial={false} custom={isBack} onExitComplete={toggleLeaving}>
                  <Row
                    //2. 키값만 바꿔줘도 새로운 Row로 인식하여 슬라이드 동작
                    custom={isBack}
                    variants={rowVariants}
                    initial="entry"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween" }}
                    key={index}
                  >
                    {nowMovie?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          //
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          $bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500") : NEXFLIX_LOGO_URL}
                          // onClick={() => onBoxClicked(movie.id + "")}
                        >
                          <Info variants={infoVariants} key={movie.id}>
                            {/* 부모로부터 hover */}
                            <h4>{movie.title}</h4>
                            <span className="material-symbols-outlined" onClick={() => onBoxClicked(movie.id + "")}>
                              expand_circle_down
                            </span>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <Btn variants={btnVariants} whileHover="hover" onClick={nextRow1}>
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </Btn>
              </Slider_row>
            </>

            <>
              <SubTitle> 곧 개봉될 영화 </SubTitle>
              <Slider_row>
                <Btn variants={btnVariants} whileHover="hover" onClick={prevRow2}>
                  <span className="material-symbols-outlined">arrow_back_ios</span>
                </Btn>
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
                    {upcoming?.results
                      .slice(1)
                      .slice(offset * indexRow2, offset * indexRow2 + offset)
                      .map((movie) => (
                        <Box
                          //
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          $bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500") : NEXFLIX_LOGO_URL}
                          // onClick={() => onBoxClicked(movie.id + "")}
                        >
                          {" "}
                          <Info variants={infoVariants} key={movie.id}>
                            {/* 부모로부터 hover */}
                            <h4>{movie.title}</h4>
                            <span className="material-symbols-outlined" onClick={() => onBoxClicked(movie.id + "")}>
                              expand_circle_down
                            </span>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <Btn variants={btnVariants} whileHover="hover" onClick={nextRow2}>
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </Btn>
              </Slider_row>
            </>

            <>
              <SubTitle> 인기순 </SubTitle>
              <Slider_row>
                <Btn variants={btnVariants} whileHover="hover" onClick={prevRow3}>
                  <span className="material-symbols-outlined">arrow_back_ios</span>
                </Btn>
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
                    {topRated?.results
                      .slice(1)
                      .slice(offset * indexRow3, offset * indexRow3 + offset)
                      .map((movie) => (
                        <Box
                          //
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          $bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500") : NEXFLIX_LOGO_URL}
                          // onClick={() => onBoxClicked(movie.id + "")}
                        >
                          <Info variants={infoVariants} key={movie.id}>
                            {/* 부모로부터 hover */}
                            <h4>{movie.title}</h4>
                            <span className="material-symbols-outlined" onClick={() => onBoxClicked(movie.id + "")}>
                              expand_circle_down
                            </span>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <Btn variants={btnVariants} whileHover="hover" onClick={nextRow3}>
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </Btn>
              </Slider_row>
            </>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayclick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                {detailLoading ? (
                  <>Loading...</>
                ) : (
                  <BigMovie>
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${
                            detail?.backdrop_path ? makeImagePath(detail.backdrop_path || detail.poster_path, "w500") : NEXFLIX_LOGO_URL
                          })`,
                        }}
                      />
                      <BigTitle>
                        {detail?.title}({detail?.vote_average?.toFixed(1)})
                      </BigTitle>
                      <BigOverview>
                        {detail?.tagline ? <h4> "{detail?.tagline}" </h4> : null}
                        <p>{content()} </p>
                      </BigOverview>
                      <BigDetail>
                        <div>RunTime : &nbsp;{detail?.runtime}</div>
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
                  </BigMovie>
                )}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
