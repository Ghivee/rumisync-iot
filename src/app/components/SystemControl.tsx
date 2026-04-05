import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Battery, Signal, RefreshCw, Zap, Radio, Bluetooth, Plus, QrCode } from "lucide-react";
import { toast } from "sonner";

const cattlePositions = [
  { id: "ID-002", position: 15 },
  { id: "ID-005", position: 28 },
  { id: "ID-007", position: 42 },
  { id: "ID-009", position: 56 },
  { id: "ID-012", position: 70 },
  { id: "ID-014", position: 85 },
];

const iTagData = [
  { id: "ID-002", mac: "A4:C1:38:7F:2E:D1", rssi: -45, status: "Sangat Kuat" },
  { id: "ID-005", mac: "B2:D8:4A:9C:1F:E3", rssi: -62, status: "Kuat" },
  { id: "ID-007", mac: "C5:E9:2B:8D:3A:F2", rssi: -58, status: "Kuat" },
  { id: "ID-009", mac: "D1:F4:5C:7E:4B:A5", rssi: -71, status: "Sedang" },
  { id: "ID-012", mac: "E3:A7:6D:9F:5C:B8", rssi: -53, status: "Kuat" },
  { id: "ID-014", mac: "F8:B2:7E:A1:6D:C9", rssi: -68, status: "Sedang" },
  { id: "ID-018", mac: "A9:C3:8F:B4:7E:D2", rssi: -49, status: "Kuat" },
  { id: "ID-003", mac: "B4:D1:9A:C5:8F:E6", rssi: -55, status: "Kuat" },
];

const maintenanceLogs = [
  { date: "2026-04-04 08:30", event: "RUMI-SYNC berhasil menyelesaikan scan pada ID-018", type: "scan" },
  { date: "2026-04-03 19:45", event: "Koneksi Bluetooth re-established dengan ID-002", type: "connection" },
  { date: "2026-04-03 14:20", event: "Sinkronisasi data aktivitas 20 sapi selesai", type: "sync" },
  { date: "2026-04-02 09:15", event: "Kalibrasi sensor rumination berhasil", type: "calibration" },
  { date: "2026-04-01 16:30", event: "Update firmware RUMI-SYNC v2.1.4", type: "update" },
  { date: "2026-03-31 12:00", event: "Pencarian iTag baru ditemukan 3 perangkat", type: "scan" },
];

export function SystemControl() {
  const [activeTab, setActiveTab] = useState("live-monitor");
  const [devicePosition, setDevicePosition] = useState(0);
  const [currentCattleIndex, setCurrentCattleIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  
  // Form states untuk TAB 2
  const [newCattleId, setNewCattleId] = useState("");
  const [newCattleGender, setNewCattleGender] = useState("Betina");
  const [newCattleAge, setNewCattleAge] = useState("");
  const [newRumiSyncSerial, setNewRumiSyncSerial] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCattleIndex((prev) => {
        let next = prev + direction;
        let newDirection = direction;

        if (next >= cattlePositions.length - 1) {
          next = cattlePositions.length - 1;
          newDirection = -1;
        } else if (next <= 0) {
          next = 0;
          newDirection = 1;
        }

        setDirection(newDirection);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    setDevicePosition(cattlePositions[currentCattleIndex].position);
  }, [currentCattleIndex]);

  const getSignalColor = (rssi: number) => {
    if (rssi > -50) return "text-green-600";
    if (rssi > -65) return "text-yellow-600";
    return "text-orange-600";
  };

  const getSignalBars = (rssi: number) => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  const handleScanBluetooth = () => {
    setIsScanning(true);
    toast.loading("Memindai iTag Bluetooth...");
    setTimeout(() => {
      setIsScanning(false);
      toast.success("Scan Selesai!", {
        description: "Ditemukan 3 iTag baru di sekitarnya"
      });
    }, 3000);
  };

  const handleSaveCattle = () => {
    if (!newCattleId.trim()) {
      toast.error("ID Sapi tidak boleh kosong");
      return;
    }
    toast.success("Sapi berhasil didaftarkan!", {
      description: `${newCattleId} (${newCattleGender}, ${newCattleAge})`
    });
    setNewCattleId("");
    setNewCattleGender("Betina");
    setNewCattleAge("");
  };

  const handleAddRumiSync = () => {
    if (!newRumiSyncSerial.trim()) {
      toast.error("Serial Number / QR Code tidak boleh kosong");
      return;
    }
    toast.success("RUMI-SYNC berhasil didaftarkan!", {
      description: `Serial: ${newRumiSyncSerial}`
    });
    setNewRumiSyncSerial("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl text-gray-800 mb-2">Kontrol Sistem & Monitoring</h1>
        <p className="text-gray-600">Manajemen Hardware & Sinkronisasi Data</p>
      </div>

      {/* Tab Navigation - Diubah warna aktifnya ke Hijau */}
      <div className="flex gap-2 bg-white rounded-lg shadow-md p-1 w-fit mx-auto">
        <motion.button
          onClick={() => setActiveTab("live-monitor")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "live-monitor"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            <span>Live Monitor</span>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("add-data")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "add-data"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Tambah Data</span>
          </div>
        </motion.button>
      </div>

      {/* TAB 1: Live Monitor */}
      {activeTab === "live-monitor" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Live Tracker Rel - Diubah ke Tema Hijau */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl text-gray-800">Live Tracker Rel</h2>
                <p className="text-sm text-gray-500">Posisi RUMI-SYNC Real-Time</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="relative h-32">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded-full transform -translate-y-1/2">
                  <div className="absolute -top-1 -bottom-1 left-0 right-0 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-full opacity-50"></div>
                </div>

                {cattlePositions.map((cattle, index) => (
                  <div
                    key={cattle.id}
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${cattle.position}%` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`text-2xl transition-transform ${currentCattleIndex === index ? 'scale-125' : ''}`}>
                        🐄
                      </div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded ${
                        currentCattleIndex === index ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {cattle.id}
                      </div>
                    </div>
                  </div>
                ))}

                <motion.div
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  animate={{ left: `${devicePosition}%` }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xs rotate-45">
                      <span className="-rotate-45">📡</span>
                    </div>
                    <div className="mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded shadow-md">
                      RUMI-SYNC
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-900">
                    Sedang memindai: <span className="font-semibold">{cattlePositions[currentCattleIndex].id}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RSSI Debugger - Tema Hijau Limau */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Signal className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl">Sinyal Sapi (RSSI Debugger)</h3>
                    <p className="text-sm text-green-50">Kekuatan Sinyal iTag Bluetooth</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">ID Sapi</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">MAC Address</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">RSSI (dBm)</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {iTagData.map((tag, index) => (
                      <motion.tr
                        key={tag.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">{tag.id}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{tag.mac}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-end gap-2">
                            <span className={`text-sm font-bold min-w-fit ${getSignalColor(tag.rssi)}`}>
                              {tag.rssi}
                            </span>
                            <div className="flex items-end gap-0.5 pb-0.5">
                              {[1, 2, 3, 4].map((bar) => (
                                <div
                                  key={bar}
                                  className={`w-1 ${
                                    bar <= getSignalBars(tag.rssi)
                                      ? getSignalColor(tag.rssi).replace('text-', 'bg-')
                                      : 'bg-gray-300'
                                  }`}
                                  style={{ height: `${bar * 3}px` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tag.status === "Sangat Kuat" ? "bg-green-100 text-green-800" :
                            tag.status === "Kuat" ? "bg-yellow-100 text-yellow-800" :
                            "bg-orange-100 text-orange-800"
                          }`}>
                            {tag.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border-t border-green-100 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-green-900">
                  <span className="text-lg">🛡️</span>
                  <span>Sistem otomatis menyaring data berdasarkan RSSI untuk mencegah data tertukar</span>
                </div>
              </div>
            </motion.div>

            {/* Activity Logs - Tema Hijau Zamrud */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl">Log Aktivitas RUMI-SYNC</h3>
                    <p className="text-sm text-green-100">Rekam kejadian sistem real-time</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {maintenanceLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-lime-50 rounded-lg hover:from-green-100 hover:to-lime-100 transition-colors border-l-4 border-green-500">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm">
                        {log.type === "scan" && <Radio className="w-4 h-4 text-green-600" />}
                        {log.type === "connection" && <Bluetooth className="w-4 h-4 text-emerald-600" />}
                        {log.type === "sync" && <RefreshCw className="w-4 h-4 text-teal-600" />}
                        {log.type === "calibration" && <RefreshCw className="w-4 h-4 text-lime-600" />}
                        {log.type === "update" && <Zap className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{log.event}</div>
                        <div className="text-xs text-gray-500 mt-1">{log.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: Tambah Data - Warna Diselaraskan dengan Skema Hijau/Lime */}
      {activeTab === "add-data" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Card 1: Daftar Sapi Baru */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Bluetooth className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-semibold">Daftar Sapi Baru</h3>
                  <p className="text-sm text-green-50">Pairing iTag Bluetooth</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <button
                  onClick={handleScanBluetooth}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white py-3 rounded-lg hover:from-lime-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  {isScanning ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Bluetooth className="w-5 h-5" />
                  )}
                  <span>{isScanning ? "Sedang Memindai..." : "Scan Bluetooth"}</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Sapi</label>
                <input
                  type="text"
                  value={newCattleId}
                  onChange={(e) => setNewCattleId(e.target.value)}
                  placeholder="Contoh: ID-025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  value={newCattleGender}
                  onChange={(e) => setNewCattleGender(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Betina">Betina</option>
                  <option value="Jantan">Jantan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Umur (Tahun-Bulan-Hari)</label>
                <input
                  type="text"
                  value={newCattleAge}
                  onChange={(e) => setNewCattleAge(e.target.value)}
                  placeholder="Contoh: 2-5-15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={handleSaveCattle}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-semibold flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>Simpan Sapi</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2: Tambah RUMI-SYNC Baru */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <QrCode className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-semibold">Tambah RUMI-SYNC Baru</h3>
                  <p className="text-sm text-green-100">Daftarkan Box RUMI-SYNC</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Serial Number / QR Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRumiSyncSerial}
                    onChange={(e) => setNewRumiSyncSerial(e.target.value)}
                    placeholder="Scan atau ketik serial..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="bg-green-100 text-green-600 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">ℹ️</div>
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-1">Informasi Perangkat</p>
                    <p className="text-xs text-green-700">Setiap RUMI-SYNC memiliki serial number unik di bagian belakang perangkat atau QR code label.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddRumiSync}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Perangkat</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}