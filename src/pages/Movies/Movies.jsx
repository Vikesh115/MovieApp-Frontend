import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovieItems, clearSearchResults } from '../../Redux/Slices/searchSlice';
import { Link } from 'react-router-dom';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { PiTelevisionFill } from "react-icons/pi";
import { MdLocalMovies } from "react-icons/md";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoSearch } from 'react-icons/io5';
import { fetchBookmarks, toggleBookmark } from '../../Redux/Slices/bookmarksSlice';
import axios from 'axios';

function Movies() {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { bookmarks } = useSelector((state) => state.bookmarks);
    const { results: searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.search);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        dispatch(fetchBookmarks(user));
        if (bookmarks.length > 0) {
            dispatch({ type: 'bookmarks/setBookmarks', payload: bookmarks });
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (search.trim()) {
            dispatch(searchMovieItems(search));
        } else {
            dispatch(clearSearchResults());
        }
    }, [search, dispatch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const movieRes = await axios.get('https://movieapp-tu5n.onrender.com/movie/getAllMovie');
            setData(movieRes.data || []);
        } catch (err) {
            setError('Failed to load data. Please try again later.', err);
        } finally {
            setLoading(false);
        }
    };

    const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : "N/A");
    const getRating = (isAdult) => (isAdult ? "18+" : "PG");

    const isBookmarked = (itemId) => {
        return (bookmarks?.movies?.some((bookmark) => bookmark?.id === itemId))
    };

    useEffect((itemId) => {
        isBookmarked(itemId)
    }, [])
    

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            console.log('Searching for:', search);
            dispatch(searchMovieItems(search));
        }
    };

    const handleBookmark = (item) => {
        const userId = user;
        const itemId = item.id;
        const type = item.media_type;

        dispatch(toggleBookmark({ userId, itemId, type })).then(() => {
            dispatch(fetchBookmarks(user));
        });
    };

    if (loading) {
        return <div className="text-center text-color4">Loading movies...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-color1 w-full h-full lg:pl-32 lg:pt-0 sm:pt-24 md:pt-36 text-color4">
            <div className="flex items-center space-x-2 p-4 bg-gray-800">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    <IoSearch size={24} />
                </button>
                <input
                    type="text"
                    placeholder="Search Movies"
                    className="flex-grow rounded-md bg-gray-700 bg-color1 text-color4 p-2 w-[100%]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {searchLoading && <div className="text-center text-color4">Searching...</div>}
            {searchError && <div className="text-center text-red-500">{searchError}</div>}
            {searchResults.length > 0 && !searchLoading && (
                <div className="mt-8">
                    <h2 className="text-color4 font-light text-2xl mb-4">Found {searchResults.length} results for {`${search}`} </h2>
                    <div className="flex flex-wrap">
                        {searchResults.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />
                                    <button onClick={() => handleBookmark(item)} className="absolute top-2 right-2 cursor-pointer z-20 rounded-full ">
                                        {isBookmarked(item?.id) ? (
                                            <MdBookmark size={"32px"} className="text-white text-2xl p-1 rounded-full" />
                                        ) : (
                                            <MdBookmarkBorder size={"32px"} className="text-white text-2xl p-1 rounded-full" />
                                        )}
                                    </button>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className='bg-color4 flex items-center rounded-xl bg-opacity-25'>
                                            <IoPlayCircleOutline
                                                size={50}
                                                className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
                                            />
                                            <Link
                                                key={item.id}
                                                to={`/movie/${item.id}`}
                                                className="p-4 bg-white rounded-lg shadow-lg flex  items-center hover:bg-gray-200"
                                            >
                                                Play
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-xs font-light mt-2 text-color4">
                                    {getReleaseYear(item?.release_date || item?.first_air_date)} .
                                    {item?.media_type === "movie" ? (
                                        <MdLocalMovies className="text-lg" />
                                    ) : (
                                        <PiTelevisionFill className="text-lg" />
                                    )}
                                    {item?.media_type.toUpperCase()} . {getRating(item?.adult)}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-color4">
                                    {item.original_title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-color4 font-medium text-xl mb-4 pl-2">Movies</h2>
                <div className="flex flex-wrap">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />
                                    <button onClick={() => handleBookmark(item)} className="absolute top-2 right-2 cursor-pointer z-20 rounded-full ">
                                        {isBookmarked(item?.id) ? (
                                            <MdBookmark size={"32px"} className="text-white text-2xl p-1 rounded-full" />
                                        ) : (
                                            <MdBookmarkBorder size={"32px"} className="text-white text-2xl p-1 rounded-full" />
                                        )}
                                    </button>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className='bg-color4 flex items-center rounded-xl bg-opacity-25'>
                                            <IoPlayCircleOutline
                                                size={50}
                                                className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
                                            />
                                            <Link
                                                key={item?.id}
                                                to={`/movie/${item?.id}`}
                                                className="p-4 bg-white rounded-lg shadow-lg flex  items-center hover:bg-gray-200"
                                            >
                                                Play
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-xs font-light mt-2 text-color4">
                                    {getReleaseYear(item?.release_date || item.first_air_date)} .
                                    {item?.media_type} . {getRating(item.adult)}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-color4">
                                    {item?.original_title || item?.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-color4">No Movies available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Movies;