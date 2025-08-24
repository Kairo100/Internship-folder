import axios from "axios";

const API_KEY = "6977944a2fc791aa08824486e3fc045c";
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTrendingMovies() {
  // Correct endpoint: trending/movie/week (movie singular)
  const res = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
}

export async function fetchPopularMovies() {
  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
}

export async function fetchMovieDetails(id) {
  const res = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
}
