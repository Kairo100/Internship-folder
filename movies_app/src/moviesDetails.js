import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
export default  function MovieDetails() {
  const { id } = useParams();

const API_KEY = "6977944a2fc791aa08824486e3fc045c";
const BASE_URL = "https://api.themoviedb.org/3";
const [movie, setmovies]= useState(null);
useEffect(()=>{
const fetchMovie = async ()=>{
  try{
   const res =  await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
  });
  setmovies( res.data);
}
catch(err){
   console.error("Failed fetching movie details:", err);
}
}
 if (id) {
      fetchMovie();
    }
},[id])
if (!movie) return <div>Loading...</div>;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem",
      
        minHeight: "100vh",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#61dafb",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "1rem",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#21a1f1")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#61dafb")}
      >
        &larr; Back to Home
      </Link>

      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "1rem",
          color:"black"
        }}
      >
        {movie.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          backgroundColor: "#1e1e1e",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title}
          style={{
            borderRadius: "12px",
            maxWidth: "350px",
            width: "100%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.7)",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, color: "#ccc" }}>
          <p>
            <strong>Release Date:</strong>{" "}
            <span style={{ color: "#aaa" }}>{movie.release_date}</span>
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            <span style={{ color: "#f39c12" }}>
              {movie.vote_average} / 10
            </span>{" "}
            <span style={{ color: "#777" }}>({movie.vote_count} votes)</span>
          </p>
          <p>
            <strong>Runtime:</strong>{" "}
            <span style={{ color: "#aaa" }}>{movie.runtime} minutes</span>
          </p>

          <h3
            style={{
              marginTop: "2rem",
              marginBottom: "0.5rem",
              color: "#61dafb",
              borderBottom: "2px solid #61dafb",
              paddingBottom: "0.25rem",
              fontWeight: "600",
            }}
          >
            Overview
          </h3>
          <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>
            {movie.overview}
          </p>

          <h3
            style={{
              marginTop: "2rem",
              marginBottom: "0.5rem",
              color: "#61dafb",
              borderBottom: "2px solid #61dafb",
              paddingBottom: "0.25rem",
              fontWeight: "600",
            }}
          >
            Genres
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                style={{
                  backgroundColor: "#282828",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  color: "#ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

