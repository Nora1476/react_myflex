import { useQuery } from "@tanstack/react-query";
import { PathMatch, useMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMovieDetail, movieDetail } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
  padding: 0 60px;
`;
const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;
const InfoWrap = styled.div`
  width: 50vw;
  height: 60vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;
const Title = styled.h2`
  font-size: 38px;
  margin-bottom: 20px;
`;

function Detail() {
  const bigMovieMatch: PathMatch<string> | null = useMatch("/detail/:Id");
  const { data: detail, isLoading: detailLoading } = useQuery<IGetMovieDetail>({
    //
    queryKey: ["movie", bigMovieMatch?.params.Id],
    queryFn: () => movieDetail(bigMovieMatch?.params.Id + ""),
    enabled: !!bigMovieMatch,
  });
  console.log(detail);

  const NEXFLIX_LOGO_URL = "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

  return (
    <Wrapper>
      {detailLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            //motion.div 설정시 props $bgPhoto를 string으로 받을 수있는 type을 설정해둔 상태
            $bgPhoto={detail?.backdrop_path || detail?.poster_path ? makeImagePath(detail?.backdrop_path || detail?.poster_path + "", "w500") : NEXFLIX_LOGO_URL}
          >
            <InfoWrap>
              <Title>{detail?.title || detail?.name}</Title>
            </InfoWrap>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Detail;
