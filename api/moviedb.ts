import axios from "axios";

export const apiKey = "c9b0f9fcab0ef3c65f1868ede22eeb74";

const baseUrl = "https://api.themoviedb.org/3";

export const imageBaseUrl = "https://image.tmdb.org/t/p/";
export const posterW185 = `${imageBaseUrl}w185`;
export const posterW342 = `${imageBaseUrl}w342`;
export const posterW500 = `${imageBaseUrl}w500`;
export const backdropW780 = `${imageBaseUrl}w780`;
export const backdropOriginal = `${imageBaseUrl}original`;

export const apiCall = async (endpoint: string, params?: Record<string, string>) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${baseUrl}${endpoint}`,
      params: { api_key: apiKey, ...params },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const fetchTrendingMovies = async () => {
  return apiCall("/trending/movie/week");
};

export const fetchUpcomingMovies = async () => {
  return apiCall("/movie/upcoming");
};

export const fetchTopRatedMovies = async () => {
  return apiCall("/movie/top_rated");
};

export const fetchMovieDetails = async (movieId: number) => {
  return apiCall(`/movie/${movieId}`);
};

export const fetchMovieCredits = async (movieId: number) => {
  return apiCall(`/movie/${movieId}/credits`);
};

export const fetchSimilarMovies = async (movieId: number) => {
  return apiCall(`/movie/${movieId}/similar`);
};

export const fetchPersonDetails = async (personId: number) => {
  return apiCall(`/person/${personId}`);
};

export const fetchPersonMovieCredits = async (personId: number) => {
  return apiCall(`/person/${personId}/movie_credits`);
};

export const fetchSearchMovies = async (query: string, page = 1) => {
  return apiCall("/search/movie", { query, page: String(page) });
};

export const fetchMovieVideos = async (movieId: number) => {
  return apiCall(`/movie/${movieId}/videos`);
};
