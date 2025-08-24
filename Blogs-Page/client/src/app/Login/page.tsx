'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  console.log("Submitting form:", form);

  try {
    const res = await axios.post(
      "https://blogs-page-njeb.onrender.com/api/auth/login",
      form
    );

    console.log("Response data:", res.data);
    const { token, role, ...user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ ...user, role }));

    // Redirect based on role
    if (role === "admin") {
      router.push("/Dashboard");
    } else {
      router.push("/");
    }

  } catch (error) {
    console.error("Login error:", error);
    setError(
     "Something went wrong"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex justify-center items-center p-5">
      <div className="bg-white rounded-[19px] shadow-md p-10 max-w-md w-full text-center font-poppins">
        <h2 className="mb-8 font-extrabold text-4xl text-[#4C0BF7]">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        {error && (
          <p className="mt-5 text-[#F1B729] font-semibold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
