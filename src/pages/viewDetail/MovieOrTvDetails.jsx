import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieOrTvDetails = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://movieapp-tu5n.onrender.com/movieandtv/detail/${id}`);
        const data = await response.json();
        setDetail(data);
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

  if (!detail) {
    return <div>Detail not found.</div>;
  }

  return (
    <div className="md:pl-24 p-6 bg-color3 min-h-screen text-color4 pt-20">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
          alt={detail.title}
          className="w-64 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold">{detail.title}</h1>
          <p className=" my-4">{detail.overview}</p>
          <p >
            <strong>Release Date:</strong>{" "}
            {new Date(detail.release_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Rating:</strong> {detail.vote_average} / 10
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieOrTvDetails;
