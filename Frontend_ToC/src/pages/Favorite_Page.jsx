import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/NewTable";
import SideNav from "../components/SideNav";
import Pagination from "../components/Pagination";
import BackButton from "../components/BackBtn";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Favorites() {
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/favorite/full`)
      .then((res) => {
        setFavoriteGames(res.data);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  const resetFavorites = () => {
    axios
      .post(`${BACKEND_URL}/favorite/reset`)
      .then(() => {
        setFavoriteGames([]);
      })
      .catch((err) => console.error("Error resetting favorites:", err));
  };

  const totalPages = Math.ceil(favoriteGames.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = favoriteGames.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading favorite games.
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row bg-cover bg-center"
      style={{ backgroundImage: "url(/TOC/Bg.jpg)" }}
    >
      {/* Overlay สีดำโปร่งใส */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* เนื้อหา */}
      <div className="relative z-10 flex flex-col md:flex-row w-full p-4 md:p-6 gap-4">
        {/* Sidebar */}
        {/* <div className="flex-none w-full md:w-60">
         <SideNav />
        </div> */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-white">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <BackButton />
              <h1 className="text-3xl font-bold">My Favorite Games</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFavorites}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={favoriteGames.length === 0}
              >
                Reset Favorites
              </button>
              <button
                onClick={() => {
                  fetch(`${BACKEND_URL}/download_Data_Favorite_CSV`)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "favorite.csv";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch((err) => console.error("Download error:", err));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={favoriteGames.length === 0}
              >
                Export Favorite game
              </button>
              <button
                onClick={() => {
                  fetch(`${BACKEND_URL}/download_Data_CSV`)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "data_all.csv";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch((err) => console.error("Download error:", err));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Export All game
              </button>
            </div>
          </div>

          {favoriteGames.length === 0 ? (
            <p className="text-gray-300">ยังไม่มีเกมที่คุณชื่นชอบ</p>
          ) : (
            <>
              <Table games={currentGames} />

              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
