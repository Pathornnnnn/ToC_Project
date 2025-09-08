import { Link } from "react-router-dom";
import "tailwindcss";
export default function Navbar() {
  return (
    <nav
      className="bg-[#151515] bg-opacity-80 px-8 py-4 flex justify-between items-center shadow-lg "
      style={{
        backgroundColor: 'rgba(21, 21, 21, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.7))'
      }}
    >
      {/* Logo */}
      <h1
        className="text-4xl tracking-widest text-white transition-colors duration-300"
        style={{ fontFamily: 'Bebas Neue, monospace' }}
      >
        TOG
      </h1>

      {/* Links */}
      <div className="space-x-8 text-lg font-semibold">
        <Link
          to="/"
          className="text-white transition-all duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-500"
          style={{ fontFamily: 'prompt, medium'}}
        >
          Home
        </Link>

        <Link
          to="/Listgame/All"
          className="text-white transition-all duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-500"          
          style={{ fontFamily: 'prompt, medium'}}
        >
          Show Games
        </Link>

        <Link
          to="/favorites"
          className="text-white transition-all duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-500"          
          style={{ fontFamily: 'prompt, medium'}}
        >
          Favorites
        </Link>

        <Link
          to="/contact"
          className="text-white transition-all duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-500"          
          style={{ fontFamily: 'prompt, medium'}}
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
}
