import { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import BackButton from "../components/BackBtn";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Contact_Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/get_contacts`)
      .then((response) => {
        setContacts(response.data);
      })
      .catch((err) => {
        console.error("Error fetching contacts:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading contacts.
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url(/TOC/Bg.jpg)" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex p-4 w-full">
        <div className="flex-1 text-white">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <BackButton />
              <h1 className="text-3xl font-bold">CONTACT US</h1>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-black/40 border border-white p-4 rounded-lg flex flex-col items-center w-75"
                >
                  {/* รูปสี่เหลี่ยมเต็มกรอบ */}
                  <div className="w-50 h-50 mb-3 overflow-hidden border border-white rounded-lg">
                    <img
                      src={`./Profile/${c.image}`}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-bold">{c.name}</h2>
                  <p className="text-sm text-gray-300">ID: {c.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
