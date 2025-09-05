import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-blue-400">🎮 GameCrawler</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>
        <Link to="/favorites" className="hover:text-blue-400">
          Favorites
        </Link>
        <Link to="/showgames" className="hover:text-blue-400">
          Show_Games
        </Link>
      </div>
    </nav>
  );
}
