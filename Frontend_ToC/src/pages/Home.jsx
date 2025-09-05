import Category from "../components/category";
export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ตัวอย่างการ์ดเกม */}
        <div className="bg-gray-800 rounded-xl shadow p-4 hover:scale-105 transition-transform">
          <img
            src="https://via.placeholder.com/300x150"
            alt="Game"
            className="rounded-lg mb-3"
          />
          <h3 className="text-lg font-semibold">Cyberpunk 2077</h3>
          <p className="text-gray-400 text-sm">RPG, Open World</p>
          <button className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            + Add to Favorite
          </button>
        </div>
      </div>
    </div>
  );
}
