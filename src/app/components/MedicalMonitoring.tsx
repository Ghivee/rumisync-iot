import { useState } from "react";
import { Search, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { motion } from "motion/react";
import { toast } from "sonner";

const cattleData = [
  { id: "ID-002", name: "SAPI LOKAL - ID-002", health: 95, status: "normal", age: { year: 3, month: 5, day: 12 }, gender: "Betina" },
  { id: "ID-005", name: "SAPI LOKAL - ID-005", health: 88, status: "warning", age: { year: 1, month: 11, day: 7 }, gender: "Jantan" },
  { id: "ID-007", name: "SAPI LOKAL - ID-007", health: 82, status: "warning", age: { year: 4, month: 2, day: 18 }, gender: "Betina" },
  { id: "ID-009", name: "SAPI LOKAL - ID-009", health: 92, status: "normal", age: { year: 2, month: 1, day: 5 }, gender: "Betina" },
  { id: "ID-012", name: "SAPI LOKAL - ID-012", health: 96, status: "normal", age: { year: 5, month: 3, day: 22 }, gender: "Jantan" },
];

const temperatureData = [
  { time: "00:00", temp: 37.2 }, { time: "02:00", temp: 37.0 }, { time: "04:00", temp: 36.8 },
  { time: "06:00", temp: 37.1 }, { time: "08:00", temp: 37.5 }, { time: "10:00", temp: 37.8 },
  { time: "12:00", temp: 38.2 }, { time: "14:00", temp: 38.5 }, { time: "16:00", temp: 38.9 },
  { time: "18:00", temp: 39.2 }, { time: "20:00", temp: 39.6 }, { time: "22:00", temp: 39.8 },
  { time: "24:00", temp: 39.7 },
];

const ruminationData = [
  { hour: "00-02", duration: 65 }, { hour: "02-04", duration: 70 }, { hour: "04-06", duration: 68 },
  { hour: "06-08", duration: 62 }, { hour: "08-10", duration: 58 }, { hour: "10-12", duration: 55 },
  { hour: "12-14", duration: 52 }, { hour: "14-16", duration: 48 }, { hour: "16-18", duration: 45 },
  { hour: "18-20", duration: 42 }, { hour: "20-22", duration: 38 }, { hour: "22-24", duration: 35 },
];

export function MedicalMonitoring() {
  const [selectedCattle, setSelectedCattle] = useState(cattleData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  const filteredCattle = cattleData.filter(cattle =>
    cattle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cattle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
  setSearchQuery(value);
  setSearchError(value && filteredCattle.length === 0 ? "Sapi tidak ditemukan" : "");
};

const handleSelectCattle = (cattleId: string) => {
  const cattle = cattleData.find(c => c.id === cattleId);
  if (cattle) {
    setSelectedCattle(cattle);
    setSearchError("");
  }
};

  const handleContactVet = () => {
    const message = encodeURIComponent(`Halo Dok, RUMI-SYNC mendeteksi indikasi PMK pada ${selectedCattle.name} dengan suhu 39.8°C dan penurunan ruminasi signifikan. Mohon segera ditangani.`);
    toast.success("Membuka WhatsApp...", { description: "Laporan medis telah disiapkan untuk dikirim ke mantri hewan" });
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-800">Pantau Medis (EWS)</h1>
          <p className="text-gray-600">Early Warning System - Analisis Klinis Detail</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari ID Sapi..." 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            {searchError && (
              <div className="absolute left-0 top-full mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg w-full border border-red-200">{searchError}</div>
            )}
          </div>
          
          {/* PERBAIKAN: Menambahkan fallback value="" agar tidak error di React saat data kosong */}
          <select 
            value={selectedCattle?.id || ""} 
            onChange={(e) => handleSelectCattle(e.target.value)} 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {filteredCattle.length > 0 ? (
              filteredCattle.map((cattle) => (
                <option key={cattle.id} value={cattle.id}>{cattle.name}</option>
              ))
            ) : (
              <option value={selectedCattle?.id || ""} disabled>Tidak ada sapi ditemukan</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-6xl mb-4 shadow-sm">🐄</div>
            <h3 className="text-xl text-gray-800">{selectedCattle.name}</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <div className="text-sm text-green-700 mb-1">Skor Kesehatan</div>
              <div className="text-4xl font-bold text-green-600">{selectedCattle.health}/100</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status:</span>
                {selectedCattle.status === "normal" ? <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Normal</span> : <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Perlu Pantauan</span>}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Suhu Terkini:</span><span className="text-red-600 font-medium">39.8°C</span></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Ruminasi Terkini:</span><span className="text-yellow-600 font-medium">35x/menit</span></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Umur:</span><span className="text-sm text-gray-800">{selectedCattle.age.year}t {selectedCattle.age.month}b {selectedCattle.age.day}h</span></div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Jenis Kelamin:</span><span className="text-sm text-gray-800">{selectedCattle.gender}</span></div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-4"><h3 className="text-xl text-gray-800">Kurva Suhu (24 Jam)</h3><p className="text-sm text-gray-500">Monitoring suhu harian - Batas Normal: 39.5°C</p></div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis domain={[36, 40]} stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} labelStyle={{ color: '#374151' }} />
                <Area type="monotone" dataKey="temp" stroke="#22c55e" strokeWidth={3} fill="url(#tempGradient)" />
                <ReferenceLine y={39.5} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Batas Bahaya 39.5°C', position: 'insideTopRight', fill: '#ef4444', fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-4"><h3 className="text-xl text-gray-800">Grafik Ruminasi (Durasi Kunyahan)</h3><p className="text-sm text-gray-500">Monitoring kunyahan harian - Rata-rata Normal: 60x/menit</p></div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ruminationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} labelStyle={{ color: '#374151' }} />
                <Bar dataKey="duration" fill="#84cc16" radius={[8, 8, 0, 0]} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Normal: 60x/mnt', position: 'insideTopRight', fill: '#f59e0b', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}