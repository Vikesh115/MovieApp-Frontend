import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchTvItems, clearSearchResults } from '../../Redux/Slices/searchSlice';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { PiTelevisionFill } from "react-icons/pi";
import { MdLocalMovies } from "react-icons/md";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { fetchBookmarks, toggleBookmark } from '../../Redux/Slices/bookmarksSlice';
import axios from 'axios';

function Tv() {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { bookmarks } = useSelector((state) => state.bookmarks);
    const { results: searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.search);
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            dispatch(searchTvItems(search)); 
        } else {
            dispatch(clearSearchResults());
        }
    }, [search, dispatch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const tvRes = await axios.get('https://movieapp-tu5n.onrender.com/tv/getAlltv');
            setData(tvRes.data || []);
        } catch (err) {
            setError('Failed to load data. Please try again later.', err);
        } finally {
            setLoading(false);
            setLoading2(false)
        }
    };

    const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : "N/A");
    const getRating = (isAdult) => (isAdult ? "18+" : "PG");

    const isBookmarked = (itemId) => {
        return (bookmarks?.tv?.some((bookmark) => bookmark?.id === itemId))
    };

    useEffect((itemId) => {
        isBookmarked(itemId)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            console.log('Searching for:', search);
            dispatch(searchTvItems(search));
        }
    };

    const handleBookmark = async (item) => {
        const userId = user;
        const itemId = item.id;
        const type = item.media_type;
        setLoading2(true)
        try {
            await dispatch(toggleBookmark({ userId, itemId, type })).then(() => {
                dispatch(fetchBookmarks(user));
            });
        } catch (error) {
            return error
        } finally{
            setLoading2(false)
        }
    };

    if (loading) {
        return (
            <div className='flex flex-row justify-center items-center w-[100%] h-screen bg-color1'>
                <div className='flex text-color4'>
                    loading tv series...
                </div>
                <div className='flex animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color0'></div>
            </div>
        )
            ;
    }

    if (loading2) {
        return (
            <div className='flex flex-row justify-center items-center w-[100%] h-screen bg-color3'>
                <div className='flex text-color4'>
                    bookmarking tv series...
                </div>
                <div className='flex animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color0'></div>
            </div>
        )
            ;
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
                    placeholder="Search TV series"
                    className="flex-grow rounded-md bg-gray-700 bg-color1 text-color4 p-2 w-[100%]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {searchLoading && <div className="flex justify-center flex-row gap-2 text-center text-color4">
                <div className='flex items-center'>Searching...</div>
                <div className='flex animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color4'></div>
                </div>}
            {searchError && <div className="text-center text-red-500">{searchError}</div>}
            {searchResults.length > 0 && !searchLoading && (
                <div className="mt-8">
                    <h2 className="text-color4 font-light text-2xl mb-4">Found {searchResults.length} results for {`${search}`} </h2>
                    <div className="flex flex-wrap">
                        {searchResults.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    <img
                                        src={item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : "https://images.pexels.com/photos/28971566/pexels-photo-28971566/free-photo-of-vibrant-anime-cosplay-with-gas-mask-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />
                                    <button onClick={() => handleBookmark(item)} className="absolute top-2 right-2 cursor-pointer z-20 rounded-full ">
                                        {isBookmarked(item.id) ? (
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
                                                to={`/tv/${item.id}`}
                                                className="p-4 bg-white rounded-lg shadow-lg flex  items-center hover:bg-gray-200"
                                            >
                                                Play
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-xs font-light mt-2 text-color4">
                                    {getReleaseYear(item.release_date || item.first_air_date)} .
                                    {item.media_type === "movie" ? (
                                        <MdLocalMovies className="text-lg" />
                                    ) : (
                                        <PiTelevisionFill className="text-lg" />
                                    )}
                                    {item.media_type.toUpperCase()} . {getRating(item.adult)}
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
                <h2 className="text-color4 font-medium text-xl mb-4 pl-2">TV Series</h2>
                <div className="flex flex-wrap">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    <img
                                        src={item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : "https://images.pexels.com/photos/28971566/pexels-photo-28971566/free-photo-of-vibrant-anime-cosplay-with-gas-mask-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />
                                    <button onClick={() => handleBookmark(item)} className="absolute top-2 right-2 cursor-pointer z-20 rounded-full ">
                                        {isBookmarked(item.id) ? (
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
                                                to={`/tv/${item.id}`}
                                                className="p-4 bg-white rounded-lg shadow-lg flex  items-center hover:bg-gray-200"
                                            >
                                                Play
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-xs font-light mt-2 text-color4">
                                    {getReleaseYear(item.release_date || item.first_air_date)} .
                                    {item.media_type} . {getRating(item.adult)}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-color4">
                                    {item.original_title || item.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-color4">No Tvs available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tv;
