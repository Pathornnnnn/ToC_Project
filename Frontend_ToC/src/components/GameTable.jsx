import React, { useState, useEffect } from "react";
import axios from "axios";
import "./gameTable.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function GameTable({ games }) {
  const [localFavorites, setLocalFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch favorite list ตอน mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/favorite/full`);
        if (Array.isArray(res.data)) {
          setLocalFavorites(res.data.map((g) => g.ID));
        } else {
          console.warn("favorite/full ไม่ใช่ array:", res.data);
          setLocalFavorites([]);
        }
      } catch (err) {
        console.error(err);
        setLocalFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const isFavorited = (game) => localFavorites.includes(game.ID);

  const toggleFavorite = async (game) => {
    const alreadyFav = isFavorited(game);

    // optimistically update UI
    setLocalFavorites((prev) =>
      alreadyFav ? prev.filter((id) => id !== game.ID) : [...prev, game.ID]
    );

    const url = alreadyFav
      ? `${BACKEND_URL}/favorite/remove`
      : `${BACKEND_URL}/favorite/add`;

    try {
      await axios.post(url, { game_id: game.ID });

      // fetch favorite list ใหม่เพื่อ sync
      const res = await axios.get(`${BACKEND_URL}/favorite/full`);
      if (Array.isArray(res.data)) {
        setLocalFavorites(res.data.map((g) => g.ID));
      }
    } catch (err) {
      console.error(err);
      // rollback UI ถ้ามี error
      setLocalFavorites((prev) =>
        alreadyFav ? [...prev, game.ID] : prev.filter((id) => id !== game.ID)
      );
    }
  };

  // กรอง games ให้ unique ตาม ID
  const uniqueGames = Array.from(new Map(games.map((g) => [g.ID, g])).values());

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  return (
    <div className="p-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Favorite</th>
            </tr>
          </thead>
          <tbody>
            {uniqueGames.map((game) => (
              <tr
                key={game.ID}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-2">{game.ID}</td>
                <td className="px-4 py-2">{game.Title}</td>
                <td className="px-4 py-2">
                  {game.Tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-600 text-white px-2 py-1 mr-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <img
                    src={game.Image}
                    alt={game.Title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{game.Date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleFavorite(game)}
                    className={`px-4 py-2 rounded w-full transition-colors ${
                      isFavorited(game)
                        ? "bg-green-700 hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isFavorited(game) ? "💚 Favorited" : "❤️ Favorite"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {uniqueGames.map((game) => (
          <div
            key={game.ID}
            className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={game.Image}
              alt={game.Title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{game.Title}</h3>
            <p className="text-gray-300 text-sm mb-2">{game.Date}</p>
            <div className="mb-2">
              {game.Tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600 text-white px-2 py-1 mr-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => toggleFavorite(game)}
              className={`px-4 py-2 rounded w-full transition-colors ${
                isFavorited(game)
                  ? "bg-green-700 hover:bg-green-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isFavorited(game) ? "💚 Favorited" : "❤️ Favorite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameTable;
