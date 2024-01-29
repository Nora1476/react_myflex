import { useQuery } from "@tanstack/react-query";
import { IGeRatedMoviesResult, IGetMoviesResult, getMovies, topRatedMovies } from "../api";
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
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
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
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background: url(${(props) => props.bgphoto}) center center / cover;
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
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
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

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  console.log(bigMovieMatch);

  // useQuery(키값지정, 데이터불러오는함수)
  const { data: nowMovie, isLoading } = useQuery<IGetMoviesResult>({ queryKey: ["movie", "nowPlaying"], queryFn: getMovies });
  const { data } = useQuery<IGeRatedMoviesResult>({ queryKey: ["movie", "top_rated"], queryFn: topRatedMovies });
  console.log(data, isLoading);

  //빠르게 여러번 동작할때 슬라이더 겹치지 않게 설정
  const [index, setIndex] = useState(0);

  //슬라이더의 key값을 바꿔주기위해 생성
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (nowMovie) {
      if (leaving) return; //true이면 아래코드 실행X  Row가 빠르게 클릭할때 모션이 겹쳐보이는 현상을 막음
      toggleLeaving();
      const totalMovies = nowMovie.results.length - 1; //메인배경으로 쓰인 영화1개는 뺀 값
      const maxIndex = Math.floor(totalMovies / offset) - 1; //페이지가 0에서 시작하기 때문에 ;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  //Row 슬라이드에 movie를 클릭하면 해당링크로 이동(상세페이지)
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  //오버레이부분 클릭시 홈링크로 이동 (상세페이지 모달끄는 용도)
  const onOverlayclick = () => {
    navigate(`${process.env.PUBLIC_URL}/`);
  };
  //Row 슬라이드에 movie 클릭이 상세페이지 정보 params으로 url내 movieId와 일치하는 nowMovie를 가져옴
  const clickedMovie = bigMovieMatch?.params.movieId && nowMovie?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            //motion.div 설정시 props bgphoto를 string으로 받을 수있는 type을 설정해둔 상태
            onClick={increaseIndex}
            bgphoto={makeImagePath(nowMovie?.results[0].backdrop_path || "")}
          >
            {/* 1. 베너 클릭할때 setIndex가 1씩 더해지면서 key 값을 인덱스를 늘려주어 새로운 Row생성효과  */}
            <Title>{nowMovie?.results[0].title}</Title>
            <OverView>{nowMovie?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              {/* initial 이 false 일 경우 컴포넌트가 처음 마운트될때 오른쪽에서 들어오는 효과 없어짐 
                  3. Row에 설정된 exit모션이 끝났을때 toggleLeaving동작하며 index + 1효과 */}
              <Row
                //2. 키값만 바꿔줘도 새로운 Row로 인식하여 슬라이드 동작
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowMovie?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      //
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        {/* 부모로부터 hover */}
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <Row></Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayclick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
