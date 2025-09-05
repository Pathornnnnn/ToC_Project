import { useEffect, useState } from "react";
import axios from "axios";
import GameTable from "../components/GameTable";
import Navbar from "../components/Navbar";
export default function Show_games() {
  console.log("Show_games");
  const [games, setGames] = useState([]);
  console.log(games);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/getdata")
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">All Games</h1>
        <GameTable games={games} />
      </div>
    </>
  );
}
