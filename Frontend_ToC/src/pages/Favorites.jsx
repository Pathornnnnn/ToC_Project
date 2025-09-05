import React, { useState, useEffect } from "react";
import axios from "axios";
import GameTable from "../components/GameTable";

export default function Favorites() {
  const [favoriteGames, setFavoriteGames] = useState([]);

  // fetch favorite ตอน mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    axios
      .get("http://127.0.0.1:8000/favorite/full")
      .then((res) => {
        setFavoriteGames(res.data);
      })
      .catch((err) => console.error(err));
  };

  const resetFavorites = () => {
    axios
      .post("http://127.0.0.1:8000/favorite/reset")
      .then(() => {
        setFavoriteGames([]); // clear local state
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Favorite Games</h2>
        <button
          onClick={resetFavorites}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset Favorites
        </button>
      </div>

      {favoriteGames.length === 0 ? (
        <p className="text-gray-400">ยังไม่มีเกมที่คุณชื่นชอบ</p>
      ) : (
        <GameTable games={favoriteGames} />
      )}

      {favoriteGames.length > 0 && (
        <button
          onClick={() => {
            // Export CSV
            const csvContent =
              "data:text/csv;charset=utf-8," +
              [
                Object.keys(favoriteGames[0]).join(","),
                ...favoriteGames.map((game) => Object.values(game).join(",")),
              ].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "favorite_games.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      )}
    </div>
  );
}
