import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home_Page";
import ListGame_Page from "./pages/ListGame_Page";
import Favorite_Page from "./pages/Favorite_Page";
import Test from "./pages/Test";
import Contact_Page from "./pages/Contact_Page";
import Footer from "./components/footer";
export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Listgame/:category" element={<ListGame_Page />} />
            <Route path="/favorites" element={<Favorite_Page />} />
            <Route path="/contact" element={<Contact_Page />} />

            <Route path="/test" element={<Test />} />
            {/* <Route path="/showgames" element={<Contact_Page />} /> */}
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
}
