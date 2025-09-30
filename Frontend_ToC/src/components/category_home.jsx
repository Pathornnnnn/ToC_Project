import "./category.css";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Category_home({ onSelectCategory }) {
  const [posts, setPost] = useState([]); // เริ่มต้นเป็น array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/getcategory`)
      .then((response) => {
        // แปลง object → array
        const data = response.data ? Object.values(response.data) : [];
        setPost(data.length > 0 ? data : null); // null = empty
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- Render ----------------
  if (loading) {
    return (
      <div className="text-center text-xl mt-20 text-white">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading categories.
      </div>
    );
  }

  if (posts === null) {
    return (
      <div className="text-center text-yellow-500 mt-20">
        กรุณา fetch data ก่อน
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "#151515" }} // พื้นหลังสีดำเข้ม
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 grid-rows-4 gap-0 text-white text-center font-mono w-full">
        {(posts || []).map((post, index) => (
          <div
            key={index}
            className="py-4 text-gray-400 hover:text-white transition-colors duration-300"
            style={{ fontFamily: "prompt, medium" }}
          >
            <a
              href={`/Listgame/${post}`}
              onClick={() => onSelectCategory && onSelectCategory(post)}
            >
              {post}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category_home;
