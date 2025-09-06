import React, { useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function Table({ games }) {
  const [localFavorites, setLocalFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // NEW

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/favorite/full`);
        if (Array.isArray(res.data)) {
          setLocalFavorites(res.data.map((g) => g.ID));
        } else {
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
    setLocalFavorites((prev) =>
      alreadyFav ? prev.filter((id) => id !== game.ID) : [...prev, game.ID]
    );

    const url = alreadyFav
      ? `${BACKEND_URL}/favorite/remove`
      : `${BACKEND_URL}/favorite/add`;

    try {
      await axios.post(url, { game_id: game.ID });

      const res = await axios.get("http://127.0.0.1:8000/favorite/full");
      if (Array.isArray(res.data)) {
        setLocalFavorites(res.data.map((g) => g.ID));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const uniqueGames = Array.from(new Map(games.map((g) => [g.ID, g])).values());

  if (loading)
    return <p className="text-white ml-60 p-4">Loading favorites...</p>;

  return (
    <div className="ml-60 p-6 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">THEORY OF GAMES</h1>

      <div className="space-y-6">
        {uniqueGames.map((game) => {
          const isExpanded = expandedDescriptions[game.ID] || false;

          return (
            <div
              key={game.ID}
              className="w-full sm:max-w-4xl mx-auto flex flex-col sm:flex-row bg-[#131d22] bg-opacity-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <img
                src={game.Image}
                alt={game.Title}
                className="w-full sm:w-48 h-48 object-cover"
              />

              {/* Info */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold mb-2">{game.Title}</h2>

                  <p
                    className={`text-gray-400 text-sm mb-2 ${
                      isExpanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {game.Description || "No description available."}
                  </p>

                  {/* Read more / Show less toggle */}
                  {/* {game.Description && game.Description.length > 100 && (
                    <button
                      className="text-cyan-400 text-xs underline mb-2"
                      onClick={() => toggleExpand(game.ID)}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )} */}

                  <div className="mb-3 flex flex-wrap">
                    {game.Tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600 text-white px-2 py-1 mr-2 mb-2 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(game)}
                  className={`flex items-center justify-center gap-2 w-36 py-2 rounded text-sm font-medium border transition-colors
    ${
      isFavorited(game)
        ? "bg-yellow-400 hover:bg-yellow-400 text-black border-yellow-400"
        : "bg-transparent hover:bg-white hover:text-black text-white border-white"
    }`}
                >
                  <img
                    src="/TOC/Save.png"
                    alt="Save Icon"
                    className="w-4 h-4"
                  />
                  {isFavorited(game) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
