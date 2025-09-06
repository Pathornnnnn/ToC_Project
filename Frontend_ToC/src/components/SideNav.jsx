import "./sidenav.css"; // import ไฟล์ css ที่สร้าง
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sidenav.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function SideNav() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getcategory`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <aside
        style={{
          backgroundColor: "rgba(19, 29, 34, 0.1)",
        }}
        className="fixed top-0 right-0 h-full w-56 text-white flex flex-col justify-between px-4 py-6 z-50 hidden md:flex"
      >
        <div>
          <div className="mb-6">
            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 mb-2 rounded text-left"
              onClick={() => (window.location.href = "/favorites")}
            >
              ★ Favorite
            </button>
            {/* <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 mb-2 rounded text-left">
              ⟳ Refresh
            </button> */}
            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 mb-2 rounded text-left"
              onClick={() => (window.location.href = "/Listgame/All")}
            >
              All Games
            </button>
          </div>
          <ul className="space-y-2 text-sm font-medium relative">
            {categories.map((cat, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-cyan-400 transition-colors relative pl-3 font-prompt"
              >
                {/* แท่งเลื่อน */}
                <div className="slide-bar"></div>
                <a href={`/Listgame/${cat}`} className="inline-block w-full">
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 w-full mt-6 py-2 rounded text-sm">
          CONTACT US
        </button>
      </aside>
    </>
  );
}

export default SideNav;
