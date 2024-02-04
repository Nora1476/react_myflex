import { useLocation, useNavigate } from "react-router-dom";
import { IGetSearchResult, multiSearch } from "../api";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  margin-top: 120px;
  padding: 0 60px;
`;
const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 60px;
`;
const Row = styled(motion.div)`
  width: 95%;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background: url(${(props) => props.$bgPhoto}) center center / cover;
  height: 200px;
  font-size: 66px;
  /* position: relative; */
  cursor: pointer;
  /* &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  } */
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

//박스 Row내 박스 hover시 동작설정
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -20,
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

function Search() {
  const location = useLocation();
  //URLSearchParams 은 자바스크립트 기능이다.
  //url이 아무리 길고 복잡해져도 원하는 값을 손쉽게 얻을 수 있다.
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: search, isLoading: searchLoading } = useQuery<IGetSearchResult>({
    //
    queryKey: ["movie", keyword],
    queryFn: () => multiSearch(keyword + ""),
    enabled: !!keyword,
  });
  console.log(search, searchLoading);

  const NEXFLIX_LOGO_URL = "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

  //박스 클릭시 모달창 띄움
  const navigate = useNavigate();
  //Row 슬라이드에 movie를 클릭하면 해당링크로 이동(상세페이지)
  const onBoxClicked = (movieId: string) => {
    navigate(`/detail/${movieId}`);
  };

  return (
    <Wrapper>
      <Title>전체 검색결과({search ? search.results.length : 0})</Title>

      <AnimatePresence initial={false}>
        <Row>
          {search?.results.map((movie) => (
            <Box
              //
              key={movie.id}
              whileHover="hover"
              initial="normal"
              variants={boxVariants}
              transition={{ type: "tween" }}
              $bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500") : NEXFLIX_LOGO_URL}
              onClick={() => onBoxClicked(movie.id + "")}
            >
              <Info variants={infoVariants}>
                {/* 부모로부터 hover */}
                <h4>{movie.title || movie.name}</h4>
              </Info>
            </Box>
          ))}
        </Row>
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
