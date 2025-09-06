import { Link } from "react-router-dom";
import "tailwindcss";
export default function Navbar() {
  return (
    <nav
      className="bg-[#131d22]
                    px-8 py-4 flex justify-between items-center 
                    shadow-lg border-b border-gray-700"
    >
      {/* Logo */}
      <h1
        className="text-2xl font-extrabold tracking-widest text-white cursor-pointer 
                     hover:text-gray-600 transition-colors duration-300"
      >
        TOG
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
          to="/Listgame/All"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          Show All_Games
        </Link>
        <Link
          to="/favorites"
          className="text-gray-500 hover:text-white transition-colors duration-300"
        >
          Favorites
        </Link>

        <Link
          to="/contact"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
}
