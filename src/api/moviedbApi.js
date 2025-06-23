import axios from "axios";

const apiUrl = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
}

export const getMoviesByPopularity = async () => {
    const endpoint = `${apiUrl}/discover/movie?sort_by=popularity.desc`;
    const response = await axios.get(endpoint,
        {headers})
    return response;
}

export const getSearchedMovies = async (searchTerm) => {
    const endpoint = `${apiUrl}/search/movie?query=${encodeURI(searchTerm)}`;
    const response = await axios.get(endpoint,
        {headers})
    return response;
}