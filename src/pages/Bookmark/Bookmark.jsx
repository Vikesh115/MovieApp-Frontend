import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchBookmarkItems, clearSearchResults } from '../../Redux/Slices/searchSlice';
import { fetchBookmarks } from '../../Redux/Slices/bookmarksSlice';
import { MdBookmarkBorder } from 'react-icons/md';
import { PiTelevisionFill } from "react-icons/pi";
import { MdLocalMovies } from "react-icons/md";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Bookmark = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { bookmarks, loading, error } = useSelector((state) => state.bookmarks);
  const { results: searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.auth);

  console.log(bookmarks);

  useEffect(() => {
    if (!search.trim()) {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchBookmarks(user));
    }
  }, [user, dispatch]);


  useEffect(() => {
    if (user && user && search.trim()) {
      dispatch(searchBookmarkItems({ userId: user, search }));
    } else if (!search.trim()) {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch, user]);

  if (!user) {
    return <p className='pl-32 pt-5'>Please log in to view your bookmarks.</p>;
  }

  const getReleaseYear = (date) => (date ? new Date(date).getFullYear() : "N/A");
  const getRating = (isAdult) => (isAdult ? "18+" : "PG");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(searchBookmarkItems({ userId: user, search }));
    }
  };

  if (loading) {
    return <div className="text-center text-color4">Loading movies and TV shows...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!bookmarks || (!bookmarks.movies?.length && !bookmarks.tv?.length)) {
    return <p className='flex justify-center lg:pt-0 sm:pt-24 md:pt-36'>No bookmarks available.</p>;
  }

  return (
    <div className="p-2 lg:pl-32 lg:pt-0 sm:pt-12 md:pt-36 bg-color1 text-color4 h-full">
      <div className="flex items-center space-x-2 p-4 bg-gray-800">
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          <IoSearch size={24} />
        </button>
        <input
          type="text"
          placeholder="Search Bookmarks"
          className="flex-grow rounded-md bg-gray-700 bg-color1 text-color4 p-2 w-[100%]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {searchLoading && <div className="text-center text-color4">Searching...</div>}
      {searchError && <div className="text-center text-red-500">{searchError}</div>}
      <div className="mt-8">
        <div className="flex flex-wrap">
          {searchResults.movies?.map((item, index) => (
            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
              <div className="relative group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                  alt={item.original_title || item.name || 'Movie/TV Show'}
                  className="w-full rounded-xl object-cover"
                />
                <div className="absolute top-2 right-2 cursor-pointer z-20 rounded-full bg-color1">

                  <MdBookmarkBorder
                    className="text-white text-2xl p-1 rounded-full  hover:bg-color4 hover:text-color1"
                    onClick={() => { }}
                    size={32}
                  />
                </div>
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
                {getReleaseYear(item.release_date || item.first_air_date)} .
                <MdLocalMovies className="text-lg" />
                {item.media_type.toUpperCase()} . {getRating(item.adult)}
              </div>
              <div className="mt-2 text-sm font-semibold text-color4">
                {item.original_title || item.name}
              </div>
            </div>
          ))}
          {searchResults.tvShows?.map((item, index) => (
            <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
              <div className="relative group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                  alt={item.original_title || item.name || 'Movie/TV Show'}
                  className="w-full rounded-xl object-cover"
                />
                <div className="absolute top-2 right-2 cursor-pointer z-20 rounded-full bg-color1">

                  <MdBookmarkBorder
                    className="text-white text-2xl p-1 rounded-full  hover:bg-color4 hover:text-color1"
                    onClick={() => { }}
                    size={32}
                  />

                </div>
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
                {getReleaseYear(item.first_air_date)} .
                <PiTelevisionFill className="text-lg" />
                {item.media_type.toUpperCase()} . {getRating(item.adult)}
              </div>
              <div className="mt-2 text-sm font-semibold text-color4">
                {item.original_title || item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookmarks && bookmarks?.movies && (
        <div className="mt-8">
          <h2 className="text-color4 font-medium text-xl mb-4">Bookmarked Movies</h2>
          <div className="flex flex-wrap">
            {bookmarks && bookmarks?.movies.map((item, index) => (
              <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                <div className="relative group">
                  {/* Image */}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                    alt={item.original_title || item.name || 'Movie/TV Show'}
                    className="w-full rounded-xl object-cover"
                  />
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
                  {getReleaseYear(item.release_date || item.first_air_date)} .
                  {item.media_type} . {getRating(item.adult)}
                </div>
                <div className="mt-2 text-sm font-semibold text-color4">
                  {item.original_title || item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {bookmarks && bookmarks?.tv && (
        <div className="mt-8">
          <h2 className="text-color4 font-medium text-xl mb-4">Bookmarked TV Series</h2>
          <div className="flex flex-wrap">
            {bookmarks && bookmarks?.tv.map((item, index) => (
              <div key={index} className="sm:w-[50%] md:w-[33%] lg:w-[25%] p-4">
                <div className="relative group">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                    alt={item.original_title || item.name || 'Movie/TV Show'}
                    className="w-full rounded-xl object-cover"
                  />
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmark;
