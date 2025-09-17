import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#151515] bg-opacity-80 text-gray-300 py-4">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-2 text-gray-300 text-sm">
        <span>
          © {new Date().getFullYear()} Powered by Theory of Games | All Rights
          Reserved
        </span>

        <a
          href="https://github.com/Pathornnnnn/ToC_Project"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-300 hover:text-white transition"
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
