import { useState } from "react";
import axios from "axios";
import Category from "../components/category";
import GameTable from "../components/GameTable";

export default function CategoryPage() {
  const [games, setGames] = useState([]);

  const handleSelectCategory = (category) => {
    // เคลียร์ข้อมูลเก่าก่อน
    setGames([]);

    axios
      .get(`http://127.0.0.1:8000/get_data_by_category/${category}`)
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Category onSelectCategory={handleSelectCategory} />
      <GameTable games={games} />
    </div>
  );
}
