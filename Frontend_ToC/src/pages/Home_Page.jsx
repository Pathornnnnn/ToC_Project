import { useState, useEffect } from "react";
import Category_home from "../components/category_home";
import "tailwindcss";
import "./css/Home.css";
import Navbar from "../components/Navbar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VIDEO_URL = import.meta.env.VITE_LINK_VIDEO;
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  // โหลด fetch ล่าสุดตอนหน้า render
  useEffect(() => {
    const fetchLast = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/fetch_last_time`);
        const data = await res.json();
        setLastFetch(data.last_fetch);
      } catch (err) {
        console.error("Error fetching last fetch time:", err);
      }
    };
    fetchLast();
  }, []);

  // Scroll indicator fade out effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollIndicator = document.getElementById("scroll-indicator");
      const scrollY = window.scrollY;

      if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 400);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/fetch_now`);
      const result = await response.json();

      alert(result.message || "Download complete!");

      // update state ทันที
      if (result.fetch_time) {
        setLastFetch(result.fetch_time);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Video Section - Full Screen */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={`${VIDEO_URL}`} type="video/mp4" />
        </video>

        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={handleDownload}
          >
            <div className="w-2 h-20 relative overflow-hidden bg-transparent">
              <div className="absolute bottom-0 left-0 w-full h-full bg-white hidden-bar"></div>
            </div>
            <span
              className="text-white text-5xl font-bold rounded px-3 py-1 transition-all duration-300"
              style={{
                fontFamily: "DM Serif Display, serif",
                letterSpacing: "0.1em",
                textShadow: "4px 4px 10px rgba(0, 0, 0, 1)",
              }}
            >
              {loading ? "Loading..." : "Fetch NOW"}
            </span>
          </div>

          {loading && (
            <div className="mt-6">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {lastFetch && (
            <p className="mt-4 text-white text-lg drop-shadow-lg">
              📅 Last fetch: {lastFetch} UTC+0
              <br />
              Fetching may take 3–4 minutes
            </p>
          )}
        </div>

        {/* Scroll Indicator */}
        <div
          id="scroll-indicator"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div
            className="flex flex-col items-center text-white animate-bounce cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all duration-300"
            onClick={() => {
              document.getElementById("category-section").scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <span className="text-sm mb-2 drop-shadow-lg">Scroll Down</span>
            <svg
              className="w-6 h-6 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div
        id="category-section"
        className="relative z-10 w-full flex flex-col items-center justify-start py-12"
        style={{ backgroundColor: "#151515", minHeight: "100vh" }}
      >
        <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-8">
          Category
        </h2>
        <div className="w-full max-w-6xl px-4">
          <Category_home />
        </div>
      </div>
    </div>
  );
}
