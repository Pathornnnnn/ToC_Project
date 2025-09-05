import { useParams } from "react-router-dom";

export default function GameDetail() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold">Game Detail #{id}</h2>
      <p className="text-gray-400">รายละเอียดเกมจะมาแสดงที่นี่</p>
    </div>
  );
}
