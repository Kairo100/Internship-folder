"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
// app/layout.tsx or app/layout.js
import './globals.css';

interface Category {
  name: string;
}

interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: Category;
}

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [visibleBlogs, setVisibleBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    axios
      .get<Blog[]>("https://blogs-page-njeb.onrender.com/api/posts")
      .then((response) => {
        setBlogs(response.data);

        const uniqueCategories = [
          "All",
          ...Array.from(new Set(response.data.map((blog) => blog.category.name))),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? blogs
        : blogs.filter((blog) => blog.category.name === selectedCategory);
    setVisibleBlogs(filtered.slice(0, 9));
  }, [blogs, selectedCategory]);

  const loadMore = () => {
    const filtered =
      selectedCategory === "All"
        ? blogs
        : blogs.filter((blog) => blog.category.name === selectedCategory);

    const next = filtered.slice(visibleBlogs.length, visibleBlogs.length + 3);
    setVisibleBlogs((prev) => [...prev, ...next]);
  };

  const randomBlog = blogs.length > 0 ? blogs[Math.floor(Math.random() * blogs.length)] : null;

  return (
    <div className="bg-[#F7F7F7] flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] flex items-center justify-center">
        <Image
          src="/images/blogs/hero.png"
          alt="Hero Section Background"
          fill
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between container mx-auto lg:px-30 text-white gap-10">
          <div className="hero-content text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">Blogs</h1>
            <p className="text-lg">
              <Link href="/">Home</Link> / <Link href="/blogs">Blogs</Link>
            </p>
          </div>
          <div className="hidden lg:block">
            <Image
              src="/images/blogs/hero2.png"
              alt="Hero Image"
              width={650}
              height={300}
              className="object-contain w-[650px] h-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Recommended Blog */}
      {randomBlog && (
        <div className="container lg:p-5 p-2 mt-10">
          <div className="lg:px-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left">
              Recommended
            </h1>

            <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="md:h-[300px] md:w-1/2">
                <Image
                  src={randomBlog.image}
                  alt={randomBlog.title}
                  className="object-cover rounded-lg w-full h-full"
                  width={700}
                  height={400}
                />
              </div>

              <div className="md:w-1/2 flex flex-col gap-5">
                <Link href={`/Blogs/${randomBlog._id}`}>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {randomBlog.title}
                  </h1>
                  <h4 className="text-lg text-gray-600 mt-2">{randomBlog.category.name}</h4>
                  <p className="text-lg mt-4">{randomBlog.description.slice(0, 100)}...</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Articles */}
      <div className="container lg:p-5 p-2 mt-10">
        <div className="lg:px-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left">
            Latest Articles
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 px-10 mb-8 justify-center md:justify-end">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-1.5 rounded font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#4C0BF7] text-white"
                  : "bg-[#F2EEFF] text-[#4C0BF7] hover:bg-[#4F8CEA] hover:text-white"
              }`}
              style={{ borderRadius: "19px" }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
          {visibleBlogs.map((blog) => (
            <Link key={blog._id} href={`/Blogs/${blog._id}`}>
              <div className="bg-white rounded shadow hover:shadow-lg transition">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className="w-full h-[250px] object-cover rounded-t"
                />
                <div className="p-5">
                  <button
                    className="px-4 py-1.5 rounded font-semibold bg-[#F2EEFF] text-[#4C0BF7]"
                    style={{ borderRadius: "19px" }}
                    disabled
                  >
                    {blog.category.name}
                  </button>
                  <p className="text-[#F1B729] text-sm mb-2 flex items-center gap-1 mt-2">
                    <Image
                      src="/images/blogs/Calendar.png"
                      alt="calendar"
                      width={20}
                      height={20}
                    />
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <h2 className="text-xl md:text-2xl text-gray-900 font-bold">{blog.title}</h2>
                  <p className="text-gray-600 mt-2">{blog.description.slice(0, 70)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        {visibleBlogs.length <
          (selectedCategory === "All"
            ? blogs.length
            : blogs.filter((b) => b.category.name === selectedCategory).length) && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="bg-[#4C0BF7] text-white text-xl px-16 py-3 font-bold hover:bg-[#4F8CEA] transition"
              style={{ borderRadius: "15px" }}
            >
              View More Blogs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
