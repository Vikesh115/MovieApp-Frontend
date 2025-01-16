import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TvDetail = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [tv, setTv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://movieapp-tu5n.onrender.com/tv/getTvcast/${id}`);
        const data = await response.json();
        setTv(data);
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

  if (!tv) {
    return <div>Movie not found.</div>;
  }

  return (
    <div className="md:pl-24 p-6 bg-color3 min-h-screen text-color4 pt-20">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          alt={tv.title}
          className="w-64 rounded-lg shadow-lg"
        />

        {/* Movie Details */}
        <div>
          <h1 className="text-4xl font-bold ">{tv.name}</h1>
          <p className=" my-4">{tv.overview}</p>
          <p className="">
            <strong>Release Date:</strong>{" "}
            {new Date(tv.release_date).toLocaleDateString()}
          </p>
          <p className="">
            <strong>Rating:</strong> {tv.vote_average} / 10
          </p>
        </div>
      </div>

      {/* Cast List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tv.cast.map((actor) => (
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

export default TvDetail;
