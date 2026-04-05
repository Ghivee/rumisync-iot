import { motion } from "motion/react";

export function Dashboard() {
  const activities = [
    { time: "14:32", id: "ID-018", temp: "37.2°C", chewing: "65x/menit", status: "normal", age: { year: 3, month: 5, day: 12 }, gender: "Betina" },
    { time: "14:28", id: "ID-012", temp: "37.8°C", chewing: "58x/menit", status: "normal", age: { year: 2, month: 8, day: 3 }, gender: "Jantan" },
    { time: "14:25", id: "ID-007", temp: "38.1°C", chewing: "52x/menit", status: "warning", age: { year: 4, month: 2, day: 18 }, gender: "Betina" },
    { time: "14:20", id: "ID-005", temp: "37.5°C", chewing: "60x/menit", status: "normal", age: { year: 1, month: 11, day: 7 }, gender: "Jantan" },
    { time: "14:15", id: "ID-003", temp: "37.3°C", chewing: "63x/menit", status: "normal", age: { year: 5, month: 3, day: 22 }, gender: "Betina" },
    { time: "14:10", id: "ID-014", temp: "38.2°C", chewing: "48x/menit", status: "warning", age: { year: 3, month: 9, day: 14 }, gender: "Jantan" },
    { time: "14:05", id: "ID-009", temp: "37.4°C", chewing: "61x/menit", status: "normal", age: { year: 2, month: 1, day: 5 }, gender: "Betina" },
    { time: "14:00", id: "ID-002", temp: "37.6°C", chewing: "59x/menit", status: "normal", age: { year: 4, month: 6, day: 11 }, gender: "Jantan" },
  ];

  const dangerCount = 0;
  const hasEmergency = dangerCount > 0;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {hasEmergency && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white px-3 sm:px-4 py-3 rounded-lg overflow-hidden relative text-sm"
        >
          <motion.div
            animate={{ x: [1000, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap"
          >
            🚨 PERINGATAN: ID-014 Suhu 39.8°C - Indikasi Demam!
          </motion.div>
        </motion.div>
      )}

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl mb-2 text-gray-800">Dashboard RUMI-SYNC</h1>
        <p className="text-xs sm:text-base text-gray-600">Pemantauan Kesehatan Sapi Real-Time</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 border-2 border-green-400 rounded-lg sm:rounded-xl p-3 sm:p-8 text-center shadow-lg"
        >
          <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">🟩</div>
          <div className="text-3xl sm:text-5xl font-bold text-green-700 mb-1 sm:mb-2">18</div>
          <div className="text-base sm:text-xl text-green-800">Sapi Aman</div>
          <div className="hidden sm:block text-sm text-green-600 mt-2">Suhu normal, kunyahan aktif</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 border-2 border-yellow-400 rounded-lg sm:rounded-xl p-3 sm:p-8 text-center shadow-lg"
        >
          <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">🟨</div>
          <div className="text-3xl sm:text-5xl font-bold text-yellow-700 mb-1 sm:mb-2">2</div>
          <div className="text-base sm:text-xl text-yellow-800">Sapi Perlu Pantauan</div>
          <div className="hidden sm:block text-sm text-yellow-600 mt-2">Kunyahan menurun, suhu normal</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 border-2 border-red-400 rounded-lg sm:rounded-xl p-3 sm:p-8 text-center shadow-lg"
        >
          <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">🟥</div>
          <div className="text-3xl sm:text-5xl font-bold text-red-700 mb-1 sm:mb-2">0</div>
          <div className="text-base sm:text-xl text-red-800">Sapi Bahaya</div>
          <div className="hidden sm:block text-sm text-red-600 mt-2">Indikasi PMK</div>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        {/* Ubah header tabel ke skema hijau */}
        <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold">Aktivitas Terkini</h2>
          <p className="text-xs sm:text-sm text-green-50">Log real-time RUMI-SYNC di rel</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base min-w-[700px]">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Waktu</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">ID Sapi</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Umur</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Kelamin</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Suhu</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Kunyahan</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map((activity, index) => (
                <motion.tr key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600">{activity.time}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-900 font-semibold">{activity.id}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600">{activity.age.year}t {activity.age.month}b {activity.age.day}h</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600">{activity.gender}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600">{activity.temp}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600">{activity.chewing}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {activity.status === "normal" ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800">Normal</span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 rounded-full bg-yellow-100 text-yellow-800">Pantau</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}