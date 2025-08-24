'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)  => { 
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await axios.post("https://blogs-page-njeb.onrender.com/api/auth/register", form);
    setSuccess("User registered successfully! You can now login.");
    setForm({ username: "", email: "", password: "" });
    setTimeout(() => router.push("/Login"), 2000);
  } catch (err) {
    console.error(error); // log full error for debugging
   
      setError( "Something went wrong!");
   
  }
};


  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#4C0BF7] font-poppins">
        Sign Up
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-4 rounded-[19px] border-2 border-[#F2EEFF] bg-[#F2EEFF] text-[#4C0BF7] text-base transition-colors focus:border-[#4C0BF7] focus:bg-white outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-4 rounded-[19px] border-2 border-[#F2EEFF] bg-[#F2EEFF] text-[#4C0BF7] text-base transition-colors focus:border-[#4C0BF7] focus:bg-white outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-8 px-5 py-4 rounded-[19px] border-2 border-[#F2EEFF] bg-[#F2EEFF] text-[#4C0BF7] text-base transition-colors focus:border-[#4C0BF7] focus:bg-white outline-none"
        />
        <button
          type="submit"
          className="w-full py-4 rounded-[19px] bg-[#4C0BF7] text-white font-extrabold text-lg shadow-md hover:bg-[#4F8CEA] hover:shadow-lg transition duration-300 cursor-pointer"
        >
          Register
        </button>
      </form>

      {error && <p className="mt-5 text-red-500 font-semibold">{error}</p>}
      {success && <p className="mt-5 text-green-600 font-semibold">{success}</p>}
    </div>
  );
}
