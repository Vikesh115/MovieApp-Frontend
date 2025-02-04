import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://movieapp-tu5n.onrender.com/movie/getMoviecast/${id}`);
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div className="md:pl-24 p-6 bg-color3 min-h-screen text-color4 pt-20">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className=" my-4">{movie.overview}</p>
          <p >
            <strong>Release Date:</strong>{" "}
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movie.cast.map((actor) => (
            <div
              key={actor.id}
              className="p-4 bg-white rounded-lg shadow-lg flex flex-col items-center"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/200"
                }
                alt={actor.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <h3 className=" font-medium text-center">
                {actor.name}
              </h3>
              <p className=" text-sm text-center">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
