"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useParams  } from "next/navigation";

export default function BlogDetailsPage() {
  // const router = useRouter();
 const params = useParams();
const id = params.id;


  const [blog, setBlog] = useState(null);
  const [randomBlog, setRandomBlog] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Fetch the blog by id
    axios
      .get(`https://blogs-page-njeb.onrender.com/api/posts/${id}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Error fetching blog details:", err);
      });




    // Fetch all blogs to get a random recommended blog
    axios
      .get("https://blogs-page-njeb.onrender.com/api/posts")
      .then((res) => {
        const blogs = res.data.filter((b) => b._id !== id);
        if (blogs.length > 0) {
          setRandomBlog(blogs[Math.floor(Math.random() * blogs.length)]);
        }
      })
      .catch(() => {});
  }, [id]);

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading blog details...
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <Image
          src="/images/blogs/hero.png"
          alt="Hero Section Background"
          fill
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 container mx-auto px-5 lg:px-20 text-white">
          <h1 className="text-5xl font-semibold mb-2">{blog.title}</h1>
          <p className="mb-4 text-lg flex items-center gap-3">
            <Link href="/">Home</Link> /{" "}
            <Link href="/blogs" className="underline">
              Blogs
            </Link>{" "}
            / <span>{blog.title}</span>
          </p>
          <div className="flex items-center gap-6">
            <span className="px-4 py-1.5 rounded font-semibold bg-[#4C0BF7]">
              {blog.category.name}
            </span>
            <span className="flex items-center gap-1 text-[#F1B729]">
              <Image
                src="/images/blogs/Calendar.png"
                alt="calendar"
                width={20}
                height={20}
              />
              {new Date(blog.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container lg:px-20 px-5 py-10 flex flex-col lg:flex-row gap-10 max-w-7xl w-full">
        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md p-8 flex-1">
          <Image
            src={blog.image}
            alt={blog.title}
            width={900}
            height={450}
            className="rounded-lg object-cover w-full mb-8"
          />
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{blog.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.description}</p>
        </article>

        {/* Sidebar: Recommended Blog */}
        {randomBlog && (
          <aside className="w-full lg:w-96 bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
            <h3 className="text-2xl font-bold mb-6 text-center">Recommended</h3>
            <Link href={`/Blogs/${randomBlog._id}`}>
              <div className="cursor-pointer flex flex-col gap-5">
                <div className="h-[200px] relative rounded-lg overflow-hidden">
                  <Image
                    src={randomBlog.image}
                    alt={randomBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 leading-tight hover:underline">
                    {randomBlog.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{randomBlog.category.name}</p>
                  <p className="mt-3 text-gray-700">
                    {randomBlog.description.slice(0, 100)}...
                  </p>
                </div>
              </div>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
