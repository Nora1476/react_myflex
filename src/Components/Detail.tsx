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
  gap: 20px;
  margin: 0 auto;
`;
const Title = styled.h2`
  font-size: 38px;
  margin-bottom: 20px;
`;
const BigOverview = styled.div`
  padding: 20px;
  /* position: relative; */
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  h4 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  p {
    line-height: 1.6;
  }
`;
const BigDetail = styled.div`
  padding: 20px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  .production {
    display: flex;
    justify-content: center;
    padding: 50px 20px 30px;
    margin-top: 100px;
    background-image: linear-gradient(to top, white, transparent);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    ul {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    li {
      display: flex;
      align-items: center;
    }
    li > img {
      max-width: 150px;
      max-height: 150px;
    }
  }
`;

function Detail() {
  const bigMovieMatch: PathMatch<string> | null = useMatch("detail/:Id");
  const { data: detail, isLoading: detailLoading } = useQuery<IGetMovieDetail>({
    //
    queryKey: ["movie", bigMovieMatch?.params.Id],
    queryFn: () => movieDetail(bigMovieMatch?.params.Id + ""),
    enabled: !!bigMovieMatch,
  });
  // console.log(detail);

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
              <BigOverview>
                {detail?.tagline ? <h4> "{detail?.tagline}" </h4> : null}
                <p>{detail?.overview} </p>
              </BigOverview>
              <BigDetail>
                <div>개봉일자 : &nbsp;{detail?.release_date} </div>
                <div>상영시간 : &nbsp;{detail?.runtime} 분</div>
                <div>
                  <h4>장르 : &nbsp;</h4>
                  <ul>
                    {detail?.genres.map((i, index) => (
                      <li key={index}>{i.name}&nbsp;/</li>
                    ))}
                  </ul>
                </div>
                <div className="production">
                  <ul>
                    {detail?.production_companies.map((i, index) =>
                      i.logo_path ? (
                        <li key={index}>
                          <img src={makeImagePath(i.logo_path, "w500")} alt="img" />
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              </BigDetail>
            </InfoWrap>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Detail;
