import React, {useEffect, useState} from 'react'
import Search from "./components/Search.jsx";
import {getMoviesByPopularity, getSearchedMovies} from "./api/moviedbApi.js";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const App = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieListByPopularity, setMovieListByPopularity] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [searchedMovieList, setSearchedMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setErrorMessage("");
        getMoviesByPopularity()
            .then((result) => {
                setMovieListByPopularity(result.data.results);
            }).catch((err) => {
            console.error(`Error fetching data:${err}`);
            setErrorMessage("Error fetching movies. Please try again later.")
        }).finally(() => setIsLoading(false))

        fetchTrendingMovies();
    }, []);


    useEffect(() => {
        if (debouncedSearchTerm.length > 0) {
            getSearchedMovies(debouncedSearchTerm).then(async (result) => {
                setSearchedMovieList(result.data.results);
                if (debouncedSearchTerm && result.data.results.length > 0) {
                    await updateSearchCount(debouncedSearchTerm, result.data.results[0]);
                }
            }).catch((err) => {
                console.error(`Error fetching data:${err}`);
                setErrorMessage("Error fetching movies. Please try again later.")
            }).finally(() => setIsLoading(false))
        } else {
            setSearchedMovieList([]);
        }
    }, [debouncedSearchTerm]);



    return (
        <main>
            <div className={"pattern"}/>
            <div className={"wrapper"}>
                <header>
                    <img src={"./hero.png"} alt={"Hero"}/>
                    <h1>
                        Find <span className={"text-gradient"}>Movies</span> You'll Enjoy
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                {trendingMovies.length > 0 && <section className="trending">
                    <h2>Trending Movies</h2>
                    <ul>
                        {trendingMovies.map((movie,index) =>
                          <li key={movie.$id}>
                              <p>{index+1}</p>
                              <img src={movie.poster_url_alt} alt={movie.title}/>
                          </li>)}
                    </ul>

                </section>}
                <section className="all-movies">
                    <h2 className="mt-[20px]">{searchedMovieList.length === 0 ?"Popular Movies" :"All Movies"}</h2>
                    {isLoading ? (<Spinner/>) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>) :
                        (<ul>
                                {searchedMovieList.length > 0 ? searchedMovieList.map((movie) =>
                                    <MovieCard
                                        key={movie.id} movie={movie}/>) : null}
                                {searchedMovieList.length === 0 && searchTerm.length === 0 ? movieListByPopularity.map((movie) =>
                                    <MovieCard key={movie.id}
                                               movie={movie}/>) : null}
                            </ul>
                        )}
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </section>

            </div>
        </main>
    )
}
export default App
