import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="relative w-10 h-10 p-0 border-0 bg-transparent cursor-pointer bg-no-repeat bg-center bg-contain"
      style={{ backgroundImage: 'url("/TOC/back.jpg")' }}
      aria-label="Go back"
    >
      <img
        src="/TOC/back.png"
        alt="Back"
        className="w-full h-full object-cover"
        style={{ objectFit: "contain" }}
      />
      <div className="absolute inset-0 bg-yellow-400 opacity-0 hover:opacity-50 transition-opacity rounded"></div>
    </button>
  );
}
