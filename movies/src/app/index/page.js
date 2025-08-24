"use client";
import Link from "next/link";
import { fetchPopularMovies, fetchTrendingMovies } from "@/utils/api";

export default async function Index() {
  // fetch data on the server directly
  const trending = await fetchTrendingMovies();
  const popular = await fetchPopularMovies();

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fff", color: "#000" }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${trending[0].backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "2rem",
          color: "#000",
          backgroundBlendMode: "multiply",
          backgroundColor: "rgba(255,255,255,0.7)", // light overlay for text readability
        }}
      >
        <h1 style={{ margin: 0, fontWeight: "bold", fontSize: "2.5rem" }}>{trending[0].title}</h1>
        <p style={{ maxWidth: "600px", fontSize: "1.1rem", lineHeight: 1.5 }}>{trending[0].overview}</p>
      </section>

      {/* Carousel Section */}
      <section style={{ padding: "1rem", overflowX: "auto", whiteSpace: "nowrap" }}>
        <h2 style={{ borderBottom: "3px solid #000", display: "inline-block", paddingBottom: "0.3rem", fontWeight: "bold" }}>
          Trending Movies
        </h2>
        {trending.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{
                display: "inline-block",
                marginRight: 12,
                cursor: "pointer",
                height: 300,
                borderRadius: 8,
                border: "2px solid #000",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Link>
        ))}
      </section>

      {/* Recommended Section */}
      <section style={{ padding: "1rem" }}>
        <h2
          style={{
            borderBottom: "3px solid #000",
            display: "inline-block",
            paddingBottom: "0.3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Recommended for You
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {popular.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div
                style={{
                  width: 150,
                  cursor: "pointer",
                  textAlign: "center",
                  border: "1.5px solid #000",
                  borderRadius: 8,
                  padding: "0.5rem",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "100%", borderRadius: 5, marginBottom: "0.5rem" }}
                />
                <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
