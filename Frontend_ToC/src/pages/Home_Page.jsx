import { useState, useEffect } from "react";
import Category_home from "../components/category_home";
import "tailwindcss";
import "./css/Home.css";
import Navbar from "../components/Navbar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LINK_VIDEO = import.meta.env.VITE_LINK_VIDEO;
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
    <>
      <Navbar />
      <div className="relative h-screen w-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={LINK_VIDEO} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={handleDownload}
          >
            <div className="w-2 h-20 relative overflow-hidden bg-transparent">
              <div className="absolute bottom-0 left-0 w-full h-full bg-white hidden-bar"></div>
            </div>
            <span className="text-white text-5xl font-bold drop-shadow-lg">
              {loading ? "Loading..." : "Fetch Now"}
            </span>
          </div>

          {loading && (
            <div className="mt-6">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* แสดงเวลาล่าสุดทันที */}
          {lastFetch && (
            <p className="mt-4 text-white text-lg">
              📅 Last fetch: {lastFetch} <br />
              Fetching may take 3–4 minutes
            </p>
          )}
        </div>
      </div>

      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ backgroundColor: "#151515" }}
      >
        <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg">
          Category
        </h2>
        <div className="w-full max-w-5xl">
          <Category_home />
        </div>
      </div>
    </>
  );
}
