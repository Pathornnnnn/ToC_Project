import { Link } from "react-router-dom";
import "tailwindcss";
export default function Navbar() {
  return (
    <nav
      className="bg-gradient-to-r from-gray-900 via-black to-gray-900 
                    px-8 py-4 flex justify-between items-center 
                    shadow-lg border-b border-gray-700"
    >
      {/* Logo */}
      <h1
        className="text-2xl font-extrabold tracking-widest text-blue-400 
                     hover:text-blue-300 transition-colors duration-300"
      >
        🎮 GameCrawler
      </h1>

      {/* Links */}
      <div className="space-x-8 text-lg font-semibold">
        <Link
          to="/"
          className="text-gray-600 hover:text-white transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          to="/favorites"
          className="text-gray-500 hover:text-white transition-colors duration-300"
        >
          Favorites
        </Link>
        <Link
          to="/Listgame/All"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          Show All Games
        </Link>
      </div>
    </nav>
  );
}
