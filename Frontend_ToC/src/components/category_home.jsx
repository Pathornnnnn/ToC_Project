import "./category.css";
import { useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function Category_home({ onSelectCategory }) {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getcategory`)
      .then((response) => setPost(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div
      style={{ backgroundColor: "#151515" }} // พื้นหลังสีดำเข้ม
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 grid-rows-4 gap-0 text-white text-center font-mono w-full">
        {posts.map((post, index) => (
          <div
            key={index}
            className="py-4 text-gray-400 hover:text-white transition-colors duration-300"
            style={{ fontFamily: 'prompt, medium'}}
          >
            <a href={`/Listgame/${post}`}> {post} </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category_home;
