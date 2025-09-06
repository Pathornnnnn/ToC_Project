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

  // Pagination states
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
        setCurrentPage(1); // reset page เมื่อโหลดใหม่
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

  const exportCSV = () => {
    if (favoriteGames.length === 0) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(favoriteGames[0]).join(","), // header
        ...favoriteGames.map((game) => Object.values(game).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "favorite_games.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(favoriteGames.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = favoriteGames.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      className="relative min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url(/TOC/Bg.jpg)" }}
    >
      {/* Overlay สีดำโปร่งใส */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* เนื้อหา */}
      <div className="relative z-10 flex p-4 mr-60 w-full">
        <BackButton />
        <SideNav />
        <div className="flex flex-col w-full ml-6">
          <div className="flex justify-between items-center mb-4 text-white">
            <h1 className="text-3xl font-bold">My Favorite Games</h1>
            <div className="flex space-x-4">
              <button
                onClick={resetFavorites}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
                      a.download = "favorite.csv"; // ชื่อไฟล์ที่ดาวน์โหลด
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch((err) => console.error("Download error:", err));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={favoriteGames.length === 0}
              >
                Export Favorite games
              </button>

              <button
                onClick={() => {
                  fetch(`${BACKEND_URL}/download_Data_CSV`)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "data.csv"; // ชื่อไฟล์ที่ดาวน์โหลด
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch((err) => console.error("Download error:", err));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={favoriteGames.length === 0}
              >
                Export All games
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
