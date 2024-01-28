import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  //URLSearchParams 은 자바스크립트 기능이다.
  //url이 아무리 길고 복잡해져도 원하는 값을 손쉽게 얻을 수 있다.
  const keyword = new URLSearchParams(location.search).get("keyword");
  return <h1>{keyword}</h1>;
}

export default Search;
