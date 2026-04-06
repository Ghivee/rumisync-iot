import { useState } from "react";
import { motion } from "motion/react";
import { Lightbulb, TrendingDown, Leaf, Search, Filter } from "lucide-react";
import { useCattle } from "../context/CattleContext";

export function EcoNutrition() {
  const { cattleData, selectedCattleId, setSelectedCattleId, selectedCattle } = useCattle();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCattle = cattleData.filter(cattle => {
    const matchesSearch = cattle.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cattle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true :
                          statusFilter === "safe" ? (cattle.status === 'normal' && parseFloat(cattle.temp) <= 39.0) :
                          statusFilter === "danger" ? (parseFloat(cattle.temp) >= 39.5 || cattle.health < 80) :
                          (!(cattle.status === 'normal' && parseFloat(cattle.temp) <= 39.0) && !(parseFloat(cattle.temp) >= 39.5 || cattle.health < 80));
    return matchesSearch && matchesStatus;
  });

  const methaneLevel = selectedCattle.methaneLevel;
  const maxMethane = 200;

  const getCategory = () => {
    if (methaneLevel < 100) return { text: "Rendah", color: "text-rs-primary", bg: "bg-rs-border", border: "border-rs-sage" };
    if (methaneLevel < 150) return { text: "Normal", color: "text-[#d97706]", bg: "bg-[#fef3c7]", border: "border-amber-300" };
    return { text: "Tinggi", color: "text-[#c25944]", bg: "bg-[#fee2e2]", border: "border-[#fca5a5]" };
  };

  const category = getCategory();

  // Speedometer Calculation (180 degrees)
  // Value goes from 0 to 200. Maps to angles 180 to 360 (or -180 to 0)
  // Let's use rotation instead of complex coordinates
  const rotationDegrees = -90 + (methaneLevel / maxMethane) * 180;

  return (
    <div className="p-3 sm:p-8 space-y-4 sm:space-y-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header - Center on Mobile, Left on Desktop */}
      <div className="text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rs-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg text-white shrink-0">
          <Leaf className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-rs-text mb-0.5 sm:mb-1">Eco-Nutrisi & Carbon Tracker</h1>
          <p className="text-rs-muted text-xs sm:text-base">Mendukung Keberlanjutan - Emisi Gas Buang</p>
        </div>
      </div>

      {/* Cattle Selection Block */}
      <div className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-6">
        <label className="text-sm font-bold text-rs-text block mb-3">Pilih Sapi untuk Analisis Nutrisi:</label>
        <div className="flex flex-col lg:flex-row gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rs-sage w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari by ID / Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 min-h-[56px] bg-rs-card-sub border-2 border-rs-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6b8e7b]/30 focus:border-rs-primary transition-all text-rs-text font-medium"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rs-sage w-5 h-5 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full lg:w-48 pl-12 pr-10 py-3 min-h-[56px] appearance-none bg-rs-card-sub border-2 border-rs-border text-rs-text font-bold rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6b8e7b]/30 focus:border-rs-primary transition-all cursor-pointer"
            >
              <option value="all">Semua</option>
              <option value="safe">Sehat</option>
              <option value="warning">Pantauan</option>
              <option value="danger">Sakit/Demam</option>
            </select>
          </div>

          <select
            value={filteredCattle.some(c => c.id === selectedCattleId) ? selectedCattleId : ""}
            onChange={(e) => setSelectedCattleId(e.target.value)}
            className="w-full lg:w-72 px-5 py-3 min-h-[56px] bg-rs-card border-2 border-rs-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6b8e7b]/30 focus:border-rs-primary transition-all text-rs-primary font-bold shadow-sm appearance-none cursor-pointer"
          >
            {filteredCattle.length > 0 ? (
              filteredCattle.map((cattle) => (
                <option key={cattle.id} value={cattle.id}>
                  {cattle.id} - {cattle.name.split(' - ')[0]}
                </option>
              ))
            ) : (
              <option value="" disabled>Sapi tak ditemukan</option>
            )}
          </select>

        </div>
        
        {filteredCattle.length === 0 && (
          <div className="mt-4 p-4 bg-[#fee2e2] text-[#c25944] rounded-xl border border-[#fca5a5] text-sm font-bold shadow-sm inline-block">
            Hasil pencarian tidak ditemukan. Silakan sesuaikan filter.
          </div>
        )}
      </div>

      {/* Speedometer Methane Emissions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-rs-card-sub border border-rs-border rounded-3xl shadow-sm p-4 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-rs-border/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl text-rs-text font-bold mb-2">Monitor Emisi Metana Harian</h2>
          <p className="text-rs-muted font-medium">{selectedCattle.name}</p>
        </div>

        <div className="flex flex-col items-center justify-center relative z-10 mt-4">
          {/* Half Circle Speedometer SVG - Fixed ViewBox from 110 to 140 to prevent bottom clipping */}
          <div className="relative w-full max-w-[320px] sm:max-w-md px-4 flex flex-col items-center">
            <svg viewBox="0 0 200 115" className="w-[85%] drop-shadow-sm overflow-visible">
              
              {/* Background Arch path definition */}
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* Green Zone 0 - 100 */}
              <path d="M 20 100 A 80 80 0 0 1 100 20" fill="transparent" stroke="#e2e8e4" strokeWidth="24" strokeLinecap="butt" />
              
              {/* Yellow Zone 100 - 150 */}
              <path d="M 100 20 A 80 80 0 0 1 156.5 43.4" fill="transparent" stroke="#fef3c7" strokeWidth="24" strokeLinecap="butt" />
              
              {/* Red Zone 150 - 200 */}
              <path d="M 156.5 43.4 A 80 80 0 0 1 180 100" fill="transparent" stroke="#fee2e2" strokeWidth="24" strokeLinecap="butt" />

              {/* Ticks and Labels */}
              <text x="10" y="105" fill="#6b8e7b" fontSize="9" fontWeight="bold" textAnchor="middle">0</text>
              <text x="50" y="40" fill="#6b8e7b" fontSize="9" fontWeight="bold" textAnchor="middle">50</text>
              <text x="100" y="10" fill="#6b8e7b" fontSize="9" fontWeight="bold" textAnchor="middle">100</text>
              <text x="160" y="30" fill="#d97706" fontSize="9" fontWeight="bold" textAnchor="middle">150</text>
              <text x="190" y="105" fill="#c25944" fontSize="9" fontWeight="bold" textAnchor="middle">200</text>

              <g transform="translate(100, 100)">
                {/* Needle */}
                <motion.g
                  initial={{ rotate: -90 }}
                  animate={{ rotate: rotationDegrees }}
                  transition={{ duration: 1.5, type: "spring", stiffness: 45 }}
                >
                  <path d="M -4 0 L 0 -85 L 4 0 Z" fill="#4c7766" filter="url(#shadow)" />
                  <circle cx="0" cy="0" r="8" fill="#2d3a33" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </motion.g>
              </g>
            </svg>

            {/* Center Display Underneath */}
            <div className="text-center mt-6">
              <div className="text-xs sm:text-sm text-rs-muted font-medium mb-1">Total Limit</div>
              <div className="text-3xl sm:text-4xl font-black text-rs-text mb-3">{methaneLevel} <span className="text-sm sm:text-lg font-bold text-rs-muted">g/hari</span></div>
              <div className={`inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-bold border ${category.border} ${category.bg} ${category.color} shadow-sm`}>
                Level Emisi: {category.text}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Analysis & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-16 sm:mt-24">
        {/* Left: Biomechanical Chewing Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-rs-sage-light rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-rs-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-rs-text">Analisis Bio-mekanik Kunyahan</h3>
              <p className="text-sm text-rs-muted font-medium">Data Terpadu dari Sensor Headstall</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`border rounded-2xl p-5 ${selectedCattle.rumination.status === 'Normal' ? 'bg-rs-card-sub border-rs-border' : 'bg-[#fef3c7] border-amber-200'}`}>
              <div className={`text-sm font-semibold mb-1 ${selectedCattle.rumination.status === 'Normal' ? 'text-rs-sage' : 'text-[#d97706]'}`}>Status Ruminasi Saat Ini</div>
              <div className="text-xl font-bold text-rs-text">{selectedCattle.rumination.status}</div>
            </div>

            <div className="bg-rs-card-sub border border-rs-border rounded-2xl p-5">
              <div className="text-sm font-semibold text-rs-sage mb-2">Deteksi Pola Pakan AI</div>
              <p className="text-rs-text leading-relaxed">
                Pakan subjek terdeteksi dominan: <span className="font-bold">{selectedCattle.rumination.feedType}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rs-sage-light rounded-2xl p-4 border border-transparent hover:border-rs-border transition-colors">
                <div className="text-xs font-semibold text-rs-muted mb-1">Frekuensi</div>
                <div className="text-lg font-bold text-rs-text">{selectedCattle.rumination.frequency}</div>
              </div>
              <div className="bg-rs-sage-light rounded-2xl p-4 border border-transparent hover:border-rs-border transition-colors">
                <div className="text-xs font-semibold text-rs-muted mb-1">Durasi Rata-rata</div>
                <div className="text-lg font-bold text-rs-text">{selectedCattle.rumination.duration}</div>
              </div>
              <div className="bg-rs-sage-light rounded-2xl p-4 border border-transparent hover:border-rs-border transition-colors">
                <div className="text-xs font-semibold text-rs-muted mb-1">Intensitas</div>
                <div className={`text-lg font-bold ${selectedCattle.rumination.intensity === "Tinggi" ? "text-[#c25944]" : selectedCattle.rumination.intensity === "Rendah" ? "text-rs-primary" : "text-[#d97706]"}`}>
                  {selectedCattle.rumination.intensity}
                </div>
              </div>
              <div className="bg-rs-sage-light rounded-2xl p-4 border border-transparent hover:border-rs-border transition-colors">
                <div className="text-xs font-semibold text-rs-muted mb-1">Kapasitas Metana</div>
                <div className="text-lg font-bold text-[#d97706]">{selectedCattle.rumination.metanePotential}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: AI Feed Advisor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-rs-primary rounded-3xl shadow-sm p-4 sm:p-8 text-white relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-rs-card/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-rs-card/20">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Feed Advisor</h3>
              <p className="text-sm text-[#e2e8e4]">Asisten Resep Emisi & Nutrisi</p>
            </div>
          </div>

          <div className="bg-rs-card rounded-2xl p-4 sm:p-8 text-rs-text shadow-lg relative z-10">
            <div className="border-b-2 border-rs-border pb-4 mb-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold flex items-center gap-2">
                  <span>📋</span> Resep Formulasi
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-rs-muted mb-2 uppercase tracking-wider">Aksi Dianjurkan</div>
                <div className="bg-rs-card-sub border border-[#d97706] p-4 rounded-xl shadow-sm">
                  <p className="text-rs-text text-sm font-medium leading-relaxed">
                    {selectedCattle.rumination.recommendation}
                  </p>
                </div>
              </div>

              <div className="bg-rs-sage-light rounded-xl p-4">
                <div className="text-xs font-semibold text-rs-muted mb-3 uppercase tracking-wider">Target Optimasi</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-rs-card p-3 rounded-lg shadow-sm border border-rs-border">
                    <span className="text-xs sm:text-sm font-semibold text-rs-sage">Reduksi Emisi</span>
                    <span className="text-sm sm:text-base font-bold text-rs-primary">{selectedCattle.rumination.targetMethane}</span>
                  </div>
                  <div className="flex justify-between items-center bg-rs-card p-3 rounded-lg shadow-sm border border-rs-border">
                    <span className="text-xs sm:text-sm font-semibold text-rs-sage">Stimulasi Pakan</span>
                    <span className="text-sm sm:text-base font-bold text-rs-primary">{selectedCattle.rumination.feedBoost}</span>
                  </div>
                  <div className="flex justify-between items-center bg-rs-card p-3 rounded-lg shadow-sm border border-rs-border">
                    <span className="text-xs sm:text-sm font-semibold text-rs-sage">Kondisi Rumen</span>
                    <span className={`text-sm sm:text-base font-bold ${selectedCattle.rumination.ruminalHealth.includes('Bahaya') ? 'text-[#c25944]' : 'text-rs-primary'}`}>{selectedCattle.rumination.ruminalHealth}</span>
                  </div>
                </div>
              </div>

              <div className="bg-rs-border border border-rs-sage/30 rounded-xl p-4 flex items-center gap-3">
                <div className="text-2xl sm:text-3xl">🌍</div>
                <div className="text-xs sm:text-sm text-rs-text">
                  <span className="font-bold block mb-0.5">Dampak Lingkungan Positif</span> 
                  Setara mengurangi emisi CO₂ mobil sejauh {Math.max(1, Math.round((200 - selectedCattle.methaneLevel) / 10))} Km/hari
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
