import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchAllItems, clearSearchResults } from '../../Redux/Slices/searchSlice'; // Adjust path as needed
import { addBookmark, deleteBookmark } from '../../Redux/Slices/bookmarksSlice'; // Adjust path as needed
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { PiTelevisionFill } from "react-icons/pi";
import { MdLocalMovies } from "react-icons/md";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoSearch } from 'react-icons/io5';

import axios from 'axios';

function Home() {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { bookmarks } = useSelector((state) => state.bookmarks);
    const { results: searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.search);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Recommended and Trending Data
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            dispatch(searchAllItems(search)); // Dispatch search only if query is not empty
        } else {
            dispatch(clearSearchResults()); // Clear search results if query is empty
        }
    }, [search, dispatch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const trendingRes = await axios.get('http://localhost:8000/movieandtv/getMovieAndTv');
            setData(trendingRes.data || []);
        } catch (err) {
            setError('Failed to load data. Please try again later.', err);
        } finally {
            setLoading(false);
        }
    };

    const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : "N/A");
    const getRating = (isAdult) => (isAdult ? "18+" : "PG");

    const isBookmarked = (itemId) => {
        return Array.isArray(bookmarks) && bookmarks.some((bookmark) => bookmark.itemId === itemId);
    };

    const handleBookmark = (item) => {
        if (!user || !user._id) {
            alert('Please log in to bookmark items.');
            return;
        }

        const bookmarkData = {
            userId: user._id,
            itemId: item.id,
            type: item.media_type,
        };

        console.log(bookmarkData);

        if (isBookmarked(item.id)) {
            dispatch(deleteBookmark(bookmarkData));
        } else {
            dispatch(addBookmark(bookmarkData));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            console.log('Searching for:', search);  // Check if query is correct
            dispatch(searchAllItems(search));
        }
    };

    if (loading) {
        return <div className="text-center text-color4">Loading movies and TV shows...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-color1 w-full h-full lg:pl-32 lg:pt-0 sm:pt-24 md:pt-36 text-color4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2 p-4 bg-gray-800">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    <IoSearch size={24} />
                </button>
                <input
                    type="text"
                    placeholder="Search Movies or Tvs"
                    className="flex-grow rounded-md bg-gray-700 bg-color1 text-color4 p-2 w-[100%]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Search Results */}
            {searchLoading && <div className="text-center text-color4">Searching...</div>}
            {searchError && <div className="text-center text-red-500">{searchError}</div>}
            {searchResults.length > 0 && !searchLoading && (
                <div className="mt-8">
                    <h2 className="text-color4 font-light text-2xl mb-4">Found {searchResults.length} results for {`${search}`} </h2>
                    <div className="flex flex-wrap">
                        {searchResults.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    {/* Image */}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />

                                    {/* Bookmark Icon */}
                                    <div className="absolute top-2 right-2 cursor-pointer z-20 rounded-full bg-color1">
                                        {isBookmarked(item.id) ? (
                                            <MdBookmark
                                                className="text-white text-2xl p-1 rounded-full hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        ) : (
                                            <MdBookmarkBorder
                                                className="text-white text-2xl p-1 rounded-full  hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        )}
                                    </div>

                                    {/* Play Icon (Visible only on hover) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className='bg-color4 flex items-center rounded-xl bg-opacity-25'>
                                            <IoPlayCircleOutline
                                                size={50}
                                                className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
                                            />
                                            <div className='flex pr-4'>
                                                Play
                                            </div>
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
                                    {item.original_title || item.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trending Section */}
            <div className="mt-8">
                <h2 className="text-color4 font-medium text-xl mb-4 pl-2">Trending</h2>
                <div className="flex overflow-x-scroll ">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="flex-shrink-0 sm:w-[65%] md:w-[65%] lg:w-[40%] p-4">
                                <div className="relative group">
                                    {/* Image */}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />

                                    {/* Bookmark Icon */}
                                    <div className="absolute top-2 right-2 cursor-pointer z-20 rounded-full bg-color1">
                                        {isBookmarked(item.id) ? (
                                            <MdBookmark
                                                className="text-white text-2xl p-1 rounded-full hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        ) : (
                                            <MdBookmarkBorder
                                                className="text-white text-2xl p-1 rounded-full  hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        )}
                                    </div>

                                    {/* Play Icon (Visible only on hover) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className='bg-color4 flex items-center rounded-xl bg-opacity-25'>
                                            <IoPlayCircleOutline
                                                size={50}
                                                className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
                                            />
                                            <div className='flex pr-4'>
                                                Play
                                            </div>
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
                                    {item.original_title || item.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-color4">No trending items available.</div>
                    )}
                </div>
            </div>

            {/* Recommended Section */}
            <div className="mt-8">
                <h2 className="text-color4 font-medium text-xl mb-4 pl-2">Recommended for You</h2>
                <div className="flex flex-wrap">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                                <div className="relative group">
                                    {/* Image */}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                        alt={item.original_title || item.name || 'Movie/TV Show'}
                                        className="w-full rounded-xl object-cover"
                                    />

                                    {/* Bookmark Icon */}
                                    <div className="absolute top-2 right-2 cursor-pointer z-20 rounded-full bg-color1">
                                        {isBookmarked(item.id) ? (
                                            <MdBookmark
                                                className="text-white text-2xl p-1 rounded-full hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        ) : (
                                            <MdBookmarkBorder
                                                className="text-white text-2xl p-1 rounded-full  hover:bg-color4 hover:text-color1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent bubbling issues
                                                    handleBookmark(item);
                                                }}
                                                size={32}
                                            />
                                        )}
                                    </div>

                                    {/* Play Icon (Visible only on hover) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className='bg-color4 flex items-center rounded-xl bg-opacity-25'>
                                            <IoPlayCircleOutline
                                                size={50}
                                                className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
                                            />
                                            <div className='flex pr-4'>
                                                Play
                                            </div>
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
                                    {item.original_title || item.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-color4">No recommendations available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
