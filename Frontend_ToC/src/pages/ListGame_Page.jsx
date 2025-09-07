import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/NewTable";
import SideNav from "../components/SideNav";
import Pagination from "../components/Pagination";
import BackButton from "../components/BackBtn";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export default function ListGame_Page() {
  const { category } = useParams();

  const [games, setGames] = useState([]);
  const [validCategories, setValidCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // จำนวนแถวที่จะแสดงต่อหน้า

  // โหลด category list
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getcategory`)
      .then((response) => {
        setValidCategories(response.data);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setError(true);
      });
  }, []);

  // โหลด games ตาม category
  useEffect(() => {
    if (validCategories.length === 0 && category !== "All") return;

    if (!validCategories.includes(category) && category !== "All") return;

    setLoading(true);
    const url =
      category === "All"
        ? `${BACKEND_URL}/getdata`
        : `${BACKEND_URL}/get_data_by_category/${category}`;

    axios
      .get(url)
      .then((response) => {
        setGames(response.data);
        setCurrentPage(1); // reset page ทุกครั้งที่โหลดข้อมูลใหม่
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, validCategories]);

  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = games.slice(indexOfFirstItem, indexOfLastItem);

  // จำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(games.length / itemsPerPage);

  // ฟังก์ชันเปลี่ยนหน้า
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Loading, error, invalid category ตามเดิม

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">Error loading data.</div>
    );
  }

  if (!validCategories.includes(category) && category !== "All") {
    return (
      <div className="text-center text-2xl text-red-500 mt-20">
        404 Not Found — Category "{category}" does not exist.
      </div>
    );
  }
  return (
    <div
      className="relative min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url(/TOC/Bg.jpg)" }}
    >
      {/* Overlay สีดำโปร่งใส */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* เนื้อหา */}
      <div className="relative z-10 flex flex-col md:flex-row w-full p-4 md:p-6 gap-6">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* BackButton + Header */}
          <div className="flex items-center space-x-4 mb-4 text-white">
            <BackButton />
            <h1 className="text-3xl font-bold">Category: {category}</h1>
          </div>

          {/* Table + Pagination */}
          <div className="w-full md:w-auto md:max-w-[calc(100%-16rem)]">
            <Table games={currentGames} />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-none w-full md:w-60 mt-4 md:mt-0">
          <SideNav />
        </div>
      </div>
    </div>
  );
}
