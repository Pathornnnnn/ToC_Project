import SideNav from "../components/SideNav";
import BackButton from "../components/BackBtn";

// ใช้ข้อมูลที่กำหนดมาแทน fetch
const contacts = [
  { name: "นายจารุเดช พนาลัย", id: "67015022" },
  { name: "นายจิรภัทร จันทกนกากร", id: "67015024" },
  { name: "นายธนากร รัตนสวัสดิ์", id: "67015060" },
  { name: "นายภูชิต คงยาง", id: "67015108" },
  { name: "นายอัครชัย วิเชียรโชติ", id: "67015164" },
  { name: "นายอธิชนัน จันทมิตร", id: "67015155" },
  { name: "นายอานัส ศรีสุวรรณ", id: "67015167" },
  { name: "นายภาธร สมแสน", id: "67015105" },
  { name: "นาย พีรพัฒน์ เครือแก้ว ณ ลำพูน", id: "67015181" },
];

// รูปที่ใช้ร่วมกันทุกคน
const PROFILE_IMG =
  "https://i.pinimg.com/736x/f9/60/a6/f960a69943d403c421c85108f6dcd185.jpg";

export default function Contact_Page() {
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
                  {/* รูป */}
                  <div className="w-40 h-40 mb-3 overflow-hidden border border-white rounded-lg">
                    <img
                      src={PROFILE_IMG}
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
