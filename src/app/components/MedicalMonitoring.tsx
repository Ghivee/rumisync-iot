import { useState, useMemo } from "react";
import { Search, HeartPulse, Activity as ActivityIcon, Thermometer, PhoneCall, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCattle } from "../context/CattleContext";

export function MedicalMonitoring() {
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

  const handleSelectCattle = (cattleId: string) => {
    setSelectedCattleId(cattleId);
  };

  const handleContactVet = () => {
    const message = encodeURIComponent(`Halo Dok, RUMI-SYNC mendeteksi anomali medis pada ${selectedCattle.name} dengan suhu ${selectedCattle.temp} dan aktivitas ruminasi bermasalah. Mohon arahan.`);
    toast.success("Membuka WhatsApp...", { description: "Laporan medis disiapkan." });
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const isSick = parseFloat(selectedCattle.temp) >= 39.5 || selectedCattle.health <= 80;

  // Generate dynamic data based on selected cow
  const temperatureData = useMemo(() => {
    const baseTemp = parseFloat(selectedCattle.temp);
    // Use the cow's ID to make the "randomness" deterministic
    const seed = selectedCattle.id.charCodeAt(selectedCattle.id.length - 1);
    
    return Array.from({length: 13}, (_, i) => {
      const modifier = Math.sin(i + seed) * (isSick ? 0.8 : 0.3);
      return {
        time: `${(i*2).toString().padStart(2, '0')}:00`,
        temp: parseFloat((baseTemp - 0.2 + modifier).toFixed(1))
      };
    });
  }, [selectedCattle.id, selectedCattle.temp, isSick]);

  const ruminationData = useMemo(() => {
    const match = selectedCattle.chewing.match(/\d+/);
    const baseDuration = match ? parseInt(match[0], 10) : 60;
    const seed = selectedCattle.id.charCodeAt(0);
    
    return Array.from({length: 12}, (_, i) => {
      const modifier = Math.cos(i + seed) * (isSick ? 15 : 5);
      return {
        hour: `${(i*2).toString().padStart(2, '0')}-${(i*2+2).toString().padStart(2, '0')}`,
        duration: Math.max(0, Math.round(baseDuration + modifier))
      };
    });
  }, [selectedCattle.id, selectedCattle.chewing, isSick]);

  return (
    <div className="p-3 sm:p-8 space-y-4 sm:space-y-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header - Center Mobile, Left Desktop */}
      <div className="text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rs-primary rounded-xl flex items-center justify-center shadow-lg text-white">
          <ActivityIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-rs-text mb-0.5 sm:mb-1">Rekam Medis & Diagnosis</h1>
          <p className="text-rs-muted text-xs sm:text-base">Analisis Kesehatan Prediktif Berbasis AI RUMI-SYNC</p>
        </div>
      </div>

      {/* Cattle Selection & Search Block */}
      <div className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-6 mb-4 sm:mb-8">
        <label className="text-sm font-bold text-rs-text block mb-3">Pilih Subjek Sapi untuk Dianalisis:</label>
        <div className="flex flex-col lg:flex-row gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rs-sage w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Ketik ID atau nama sapi..."
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
              <option value="all">Semua Status</option>
              <option value="safe">Status Aman</option>
              <option value="warning">Pantauan</option>
              <option value="danger">Sakit/Demam</option>
            </select>
          </div>

          <select
            value={filteredCattle.some(c => c.id === selectedCattleId) ? selectedCattleId : ""}
            onChange={(e) => handleSelectCattle(e.target.value)}
            className="w-full lg:w-72 px-5 py-3 min-h-[56px] bg-rs-card border-2 border-rs-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6b8e7b]/30 focus:border-rs-primary transition-all text-rs-primary font-bold shadow-sm appearance-none cursor-pointer"
          >
            {filteredCattle.length > 0 ? (
              filteredCattle.map((cattle) => (
                <option key={cattle.id} value={cattle.id}>
                  {cattle.id} - {cattle.name.split(' - ')[0]}
                </option>
              ))
            ) : (
              <option value="" disabled>Sapi tidak ditemukan</option>
            )}
          </select>

        </div>
        {filteredCattle.length === 0 && (
          <div className="mt-4 p-4 bg-[#fee2e2] text-[#c25944] rounded-xl border border-[#fca5a5] text-sm font-bold shadow-sm inline-block">
            Tidak ada sapi yang cocok dengan pencarian dan filter Anda.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Identitas Sapi */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-rs-sage-light border-4 border-rs-border rounded-full flex items-center justify-center text-6xl mb-5 shadow-inner overflow-hidden">
               <span className="opacity-80">🐄</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-rs-text">{selectedCattle.name}</h3>
            <p className="text-rs-muted font-medium">{selectedCattle.id} • {selectedCattle.gender}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-rs-card-sub border border-rs-border rounded-2xl p-5 text-center">
              <div className="text-sm font-semibold text-rs-sage mb-2">Skor Kesehatan Global</div>
              <div className={`text-4xl sm:text-5xl font-black ${isSick ? 'text-[#c25944]' : 'text-rs-primary'}`}>{selectedCattle.health}/100</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-rs-sage-light rounded-xl">
                <span className="text-sm font-medium text-rs-muted">Status Klinis:</span>
                {parseFloat(selectedCattle.temp) >= 39.5 || selectedCattle.health <= 80 ? (
                  <span className="px-4 py-1.5 bg-[#fee2e2] text-[#c25944] font-bold rounded-full text-sm">Sakit / Demam</span>
                ) : selectedCattle.status === "normal" ? 
                  <span className="px-4 py-1.5 bg-rs-border text-rs-primary font-bold rounded-full text-sm">Normal Terkendali</span> : 
                  <span className="px-4 py-1.5 bg-[#fef3c7] text-[#d97706] font-bold rounded-full text-sm">Perlu Pantauan</span>
                }
              </div>
              <div className="flex justify-between items-center p-4 bg-rs-sage-light rounded-xl">
                <span className="text-sm font-medium text-rs-muted">Suhu Tubuh:</span>
                <span className={`font-bold ${parseFloat(selectedCattle.temp) > 39.0 ? 'text-[#c25944]' : 'text-rs-primary'}`}>{selectedCattle.temp} °C</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rs-sage-light rounded-xl">
                <span className="text-sm font-medium text-rs-muted">Laju Ruminasi:</span>
                <span className="text-rs-text font-bold">{selectedCattle.chewing}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rs-sage-light rounded-xl">
                <span className="text-sm font-medium text-rs-muted">Usia Tercatat:</span>
                <span className="text-sm font-bold text-rs-text">{selectedCattle.age.year}t {selectedCattle.age.month}b {selectedCattle.age.day}h</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rs-sage-light rounded-xl">
                <span className="text-sm font-medium text-rs-muted">Ras Dominan:</span>
                <span className="text-sm font-bold text-rs-text">{selectedCattle.breed}</span>
              </div>
            </div>

            {/* Hubungi Mantri Hewan (Modern, non-animated if sick, hidden if not) */}
            {isSick && (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactVet}
                className="w-full mt-6 bg-[#c25944] hover:bg-[#b04a37] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md border-b-4 border-[#9a3f2d] transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <PhoneCall className="w-6 h-6" />
                <span className="text-lg">Telepon Mantri Hewan</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 bg-[#fee2e2] rounded-xl text-[#c25944]"><HeartPulse className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold text-rs-text">Kurva Suhu (24 Jam)</h3>
                <p className="text-sm text-rs-muted">Batas Normal: Terindikasi di bawah 39.5°C</p>
              </div>
            </div>
            <ResponsiveContainer key={`temp-${selectedCattle.id}`} width="100%" height={300}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isSick ? "#c25944" : "#4c7766"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isSick ? "#c25944" : "#4c7766"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e4" vertical={false} />
                <XAxis dataKey="time" stroke="#6b8e7b" style={{ fontSize: '12px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis domain={[36, 41]} stroke="#6b8e7b" style={{ fontSize: '12px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8e4', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} labelStyle={{ color: '#6b7280', marginBottom: '4px' }} itemStyle={{ color: isSick ? "#c25944" : "#4c7766", fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="temp" stroke={isSick ? "#c25944" : "#4c7766"} strokeWidth={4} fill="url(#tempGradient)" />
                <ReferenceLine y={39.5} stroke="#c25944" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Batas Demam 39.5°C', position: 'insideTopRight', fill: '#c25944', fontSize: 13, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-rs-card rounded-3xl shadow-sm border border-rs-border p-4 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 bg-rs-border rounded-xl text-rs-primary"><ActivityIcon className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold text-rs-text">Grafik Ruminasi Lanjutan</h3>
                <p className="text-sm text-rs-muted">Durasi Kunyahan per Menit - Normal di atas 60x/mnt</p>
              </div>
            </div>
            <ResponsiveContainer key={`rum-${selectedCattle.id}`} width="100%" height={300}>
              <BarChart data={ruminationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e4" vertical={false} />
                <XAxis dataKey="hour" stroke="#6b8e7b" style={{ fontSize: '12px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#6b8e7b" style={{ fontSize: '12px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f4f5f2' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8e4', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} labelStyle={{ color: '#6b7280', marginBottom: '4px' }} itemStyle={{ color: '#6b8e7b', fontWeight: 'bold' }} />
                <Bar dataKey="duration" fill={isSick ? "#d97706" : "#4c7766"} radius={[8, 8, 8, 8]} barSize={24} />
                <ReferenceLine y={60} stroke="#c25944" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Ambang Kritis 60x/mnt', position: 'insideTopRight', fill: '#c25944', fontSize: 13, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}