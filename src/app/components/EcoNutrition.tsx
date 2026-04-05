import { useState } from "react";
import { motion } from "motion/react";
import { Lightbulb, TrendingDown, Leaf } from "lucide-react";
import { toast } from "sonner";

const cattleData = [
  { 
    id: "ID-002", 
    name: "SAPI LOKAL - ID-002", 
    methaneLevel: 110,
    rumination: {
      status: "Kunyahan Normal & Aktif",
      frequency: "58x/mnt",
      duration: "3.5 detik",
      intensity: "Sedang",
      metanePotential: "Kategori Normal",
      feedType: "Rumput segar + konsentrat seimbang",
      recommendation: "1.0 Kg dedak pada pakan sore",
      targetMethane: "110g → 100g/hari",
      feedBoost: "+8%",
      ruminalHealth: "Optimal"
    }
  },
  { 
    id: "ID-005", 
    name: "SAPI LOKAL - ID-005", 
    methaneLevel: 140,
    rumination: {
      status: "Kunyahan Lambat & Tidak Konsisten",
      frequency: "42x/mnt",
      duration: "3.8 detik",
      intensity: "Tinggi",
      metanePotential: "Kategori Tinggi",
      feedType: "Jerami kering dominan, kurang konsentrat",
      recommendation: "2.0 Kg konsentrat pada pakan pagi dan sore",
      targetMethane: "140g → 115g/hari",
      feedBoost: "+15%",
      ruminalHealth: "Perlu monitor"
    }
  },
  { 
    id: "ID-007", 
    name: "SAPI LOKAL - ID-007", 
    methaneLevel: 120,
    rumination: {
      status: "Kunyahan Lambat & Berat",
      frequency: "45x/mnt",
      duration: "3.2 detik",
      intensity: "Tinggi",
      metanePotential: "Sedang",
      feedType: "Serat kasar/jerami kering dominan",
      recommendation: "1.5 Kg konsentrat pada pakan sore",
      targetMethane: "120g → 102g/hari",
      feedBoost: "+12%",
      ruminalHealth: "Optimal"
    }
  },
  { 
    id: "ID-009", 
    name: "SAPI LOKAL - ID-009", 
    methaneLevel: 95,
    rumination: {
      status: "Kunyahan Cepat & Aktif",
      frequency: "65x/mnt",
      duration: "2.9 detik",
      intensity: "Rendah",
      metanePotential: "Rendah",
      feedType: "Pakan berkualitas tinggi dengan konsentrat optimal",
      recommendation: "Pertahankan formulasi pakan saat ini",
      targetMethane: "95g → 88g/hari",
      feedBoost: "+5%",
      ruminalHealth: "Sangat Optimal"
    }
  },
  { 
    id: "ID-012", 
    name: "SAPI LOKAL - ID-012", 
    methaneLevel: 130,
    rumination: {
      status: "Kunyahan Sedang & Moderat",
      frequency: "52x/mnt",
      duration: "3.4 detik",
      intensity: "Sedang",
      metanePotential: "Normal",
      feedType: "Campuran rumput dan jerami dengan konsentrat",
      recommendation: "1.2 Kg dedak untuk optimasi fermentasi",
      targetMethane: "130g → 112g/hari",
      feedBoost: "+13%",
      ruminalHealth: "Optimal"
    }
  },
];

export function EcoNutrition() {
  const [selectedCattle, setSelectedCattle] = useState(cattleData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const methaneLevel = selectedCattle.methaneLevel;
  const maxMethane = 200;
  const percentage = (methaneLevel / maxMethane) * 100;

  const filteredCattle = cattleData.filter((cattle) =>
    cattle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cattle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCattle = (cattleId) => {
    const cattle = cattleData.find(c => c.id === cattleId);
    if (cattle) {
      setSelectedCattle(cattle);
    }
  };

  const getNeedleRotation = () => {
    return -90 + (percentage * 1.8);
  };

  const getCategory = () => {
    if (methaneLevel < 100) return { text: "Rendah", color: "text-green-600", bg: "bg-green-50" };
    if (methaneLevel < 150) return { text: "Normal", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Tinggi", color: "text-red-600", bg: "bg-red-50" };
  };

  const category = getCategory();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl text-gray-800 mb-2">Eco-Nutrisi & Carbon Tracker</h1>
        <p className="text-gray-600">Fitur "Penyelamat Bumi" - Optimasi Pakan & Emisi</p>
      </div>

      {/* Cattle Selection */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">Pilih Sapi untuk Dianalisis:</label>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Cari ID atau nama sapi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={selectedCattle.id}
              onChange={(e) => handleSelectCattle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {filteredCattle.length > 0 ? (
                filteredCattle.map((cattle) => (
                  <option key={cattle.id} value={cattle.id}>
                    {cattle.name}
                  </option>
                ))
              ) : (
                <option disabled>Sapi tidak ditemukan</option>
              )}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Speedometer Methane Emissions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl text-gray-800 font-bold mb-2">Speedometer Emisi Metana</h2>
          <p className="text-gray-600">{selectedCattle.name}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Horizontal Speedometer SVG */}
          <div className="relative w-full max-w-2xl">
            <svg viewBox="0 0 400 160" className="w-full h-auto drop-shadow-lg" style={{ minHeight: '120px' }}>
              {/* Outer background rectangle */}
              <rect x="20" y="50" width="360" height="45" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" rx="8" />
              
              {/* Green Zone (0-100) */}
              <rect x="20" y="50" width="120" height="45" fill="#22c55e" opacity="0.2" rx="8" />
              
              {/* Yellow Zone (100-150) */}
              <rect x="140" y="50" width="90" height="45" fill="#eab308" opacity="0.2" />
              
              {/* Red Zone (150-200) */}
              <rect x="230" y="50" width="150" height="45" fill="#ef4444" opacity="0.2" rx="8" />

              {/* Tick marks and labels */}
              {[0, 50, 100, 150, 200].map((value) => {
                const x = 20 + (value / 200) * 360;
                return (
                  <g key={value}>
                    <line x1={x} y1="50" x2={x} y2="60" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                    <text x={x} y="43" fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="600">
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* Zone labels */}
              <text x="80" y="120" fill="#22c55e" fontSize="11" fontWeight="bold" textAnchor="middle">
                Rendah
              </text>
              <text x="185" y="120" fill="#eab308" fontSize="11" fontWeight="bold" textAnchor="middle">
                Sedang
              </text>
              <text x="305" y="120" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                Tinggi
              </text>

              {/* Needle indicator - Enhanced */}
              <motion.g
                initial={{ x: 20 }}
                animate={{ x: 20 + (methaneLevel / 200) * 360 }}
                transition={{ duration: 1.5, type: "spring", stiffness: 60 }}
              >
                {/* Needle shadow */}
                <path
                  d="M 0 30 L -6 70 L 0 75 L 6 70 Z"
                  fill="#000000"
                  opacity="0.15"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                />
                {/* Main needle */}
                <path
                  d="M 0 30 L -5 70 L 0 75 L 5 70 Z"
                  fill="#ef4444"
                  stroke="#991b1b"
                  strokeWidth="1.5"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))"
                />
                {/* Needle highlight */}
                <path
                  d="M -1.5 35 L -3 65 L 0 68 L 3 65 Z"
                  fill="#ffffff"
                  opacity="0.4"
                />
              </motion.g>
            </svg>

            {/* Center Display */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500 mb-2">Estimasi Emisi</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{methaneLevel} <span className="text-2xl">g/hari</span></div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-md ${category.bg} ${category.color}`}>
                {category.text}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Analysis & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Biomechanical Chewing Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl text-gray-800">Analisis Bio-mekanik Kunyahan</h3>
              <p className="text-sm text-gray-500">Data dari sensor KY-038</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Status Ruminasi</div>
              <div className="text-xl text-blue-900">{selectedCattle.rumination.status}</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Prediksi AI</div>
              <p className="text-gray-800">
                Pakan saat ini didominasi <span className="font-semibold">{selectedCattle.rumination.feedType}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Frekuensi</div>
                <div className="text-lg text-gray-800">{selectedCattle.rumination.frequency}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Durasi Rata-rata</div>
                <div className="text-lg text-gray-800">{selectedCattle.rumination.duration}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Intensitas</div>
                <div className={`text-lg ${selectedCattle.rumination.intensity === "Tinggi" ? "text-orange-600" : selectedCattle.rumination.intensity === "Rendah" ? "text-green-600" : "text-blue-600"}`}>
                  {selectedCattle.rumination.intensity}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Potensi Metana</div>
                <div className="text-lg text-yellow-600">{selectedCattle.rumination.metanePotential}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: AI Feed Advisor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl">AI Feed Advisor</h3>
              <p className="text-sm text-green-100">Rekomendasi Pakan Cerdas</p>
            </div>
          </div>

          {/* Prescription-style box */}
          <div className="bg-white rounded-lg p-6 text-gray-800 shadow-md">
            <div className="border-b-2 border-green-500 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-lg">📋 Resep Nutrisi</div>
                <div className="text-sm text-gray-500">ID: {selectedCattle.id}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">💡 Saran Sistem</div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedCattle.rumination.recommendation}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">🎯 Target Optimasi</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emisi Metana:</span>
                    <span className="font-semibold text-blue-600">{selectedCattle.rumination.targetMethane}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Efisiensi Pakan:</span>
                    <span className="font-semibold text-green-600">{selectedCattle.rumination.feedBoost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Kesehatan Rumen:</span>
                    <span className="font-semibold text-green-600">{selectedCattle.rumination.ruminalHealth}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">📦 Komposisi Pakan Baru</div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex justify-between">
                    <span>• Jerami/Rumput</span>
                    <span className="font-medium">60%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Konsentrat/Dedak</span>
                    <span className="font-medium text-green-600">30% ↑</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Mineral Mix</span>
                    <span className="font-medium">10%</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <div className="text-sm text-green-800">
                  <span className="font-semibold">Dampak Lingkungan:</span> Setara mengurangi emisi CO₂ mobil sejauh {Math.round((200 - selectedCattle.methaneLevel) / 10)} Km/hari
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
