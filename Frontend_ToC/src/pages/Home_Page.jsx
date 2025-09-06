import Category_home from "../components/category_home";
import "tailwindcss";
import "./css/Home.css"; // สำหรับ animation
import Navbar from "../components/Navbar";
export default function Home() {
  return (
    <>
      <Navbar />
      {/* Section Video */}
      <div className="relative h-screen w-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/TOC/VDO_Background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content บนวิดีโอ */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          {/* Container ข้อความ + แท่ง */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            {/* แท่งเล็กโปร่งใสซ่อนตอนแรก */}
            <div className="w-2 h-20 relative overflow-hidden bg-transparent">
              <div className="absolute bottom-0 left-0 w-full h-full bg-white hidden-bar"></div>
            </div>
            {/* ข้อความ */}
            <span className="text-white text-5xl font-bold drop-shadow-lg">
              Download NOW
            </span>
          </div>
        </div>
      </div>

      {/* Section Category */}
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ backgroundColor: "#151515" }}
      >
        <h2
          className="text-3xl font-bold text-white text-center drop-shadow-lg"
          style={{ margin: 0, padding: 0 }}
        >
          Category
        </h2>
        <div className="w-full max-w-5xl" style={{ padding: 0, margin: 0 }}>
          <Category_home />
        </div>
      </div>
    </>
  );
}
