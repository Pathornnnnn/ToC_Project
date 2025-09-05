import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import GameDetail from "./pages/GameDetail";
import Show_games from "./pages/Show_games";
import CategoryPage from "./pages/Category";
export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/showgames" element={<Show_games />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
