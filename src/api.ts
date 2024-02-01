const API_KEY = "ecb4b2614e7b492c49bbe1b66d160f40";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface IRatedMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: number;
  title: string;
  overview: string;
  popularity: number;
  vote_average: number;
}

interface ITv {
  id: number;
  first_air_date: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

//받아오는 정화정보에 대한 타입지정(Home.tsx)
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGeRatedMoviesResult {
  page: number;
  results: IRatedMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  genres: [{ id: number; name: string }];
  homepage: string;
  id: number;
  title: string;
  runtime: number;
  tagline: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

//받아오는 TV정보에 대한 타입지정(Home.tsx)
export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvsDetail {
  adult: boolean;
  backdrop_path: string;
  genres: [{ id: number; name: string }];
  homepage: string;
  id: number;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  overview: string;
  poster_path: string;
  type: string;
}

//fetch함수를 통해 영화 정보를 받아옴
//&language=ko-Kr 주소끝에 삽입
//현재상영작 now_playing
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}
//상위 랭크 top_rated
export function topRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) => response.json());
}
//TV show Detail
export function movieDetail(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then((response) => response.json());
}

//현재상영 TV show
export function getTvShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) => response.json());
}
//TV show Detail
export function tvShowDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then((response) => response.json());
}
