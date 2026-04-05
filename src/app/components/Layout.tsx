import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Home, Activity, Leaf, Settings, Bell, X } from "lucide-react";
import { Toaster } from "./ui/sonner";

// Custom Battery Icon Component (Phone Style)
const BatteryIndicator = ({ level }: { level: number }) => {
  const getColors = () => {
    if (level > 20) return { fill: "#10b981", border: "border-gray-400" }; // green-500
    if (level > 10) return { fill: "#f59e0b", border: "border-amber-400" }; // amber-500
    return { fill: "#ef4444", border: "border-red-400" }; // red-500
  };

  const { fill, border } = getColors();

  return (
    <div className="flex items-center gap-1.5">
      <div className={`relative w-8 h-4 border-2 ${border} rounded-[3px] p-[1px] flex items-center`}>
        <div className="w-full h-full overflow-hidden rounded-[1px]">
          <div 
            className="h-full transition-all duration-1000 ease-in-out"
            style={{ width: `${level}%`, backgroundColor: fill }}
          />
        </div>
        <div className={`absolute -right-[4px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 ${border.replace('border-', 'bg-')} rounded-r-[1px]`} />
      </div>
      <span className="text-xs sm:text-sm font-bold text-gray-700 min-w-[32px]">
        {Math.round(level)}%
      </span>
    </div>
  );
};

export function Layout() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(40);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryLevel((prev) => (prev <= 1 ? 100 : prev - 1));
    }, 120000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const notifications = [
    { id: 1, type: "warning", message: "ID-007: Kunyahan menurun - Perlu pantauan", time: "10 menit lalu" },
    { id: 2, type: "warning", message: "ID-014: Kunyahan menurun - Perlu pantauan", time: "25 menit lalu" },
    { id: 3, type: "info", message: "RUMI-SYNC berhasil memindai 20 sapi", time: "1 jam lalu" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" richColors />
      {/* Top Bar - Diperbaiki layout responsive-nya */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          {/* Ubah warna logo ke hijau */}
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-lg sm:text-xl">🐄</span>
          </div>
          {/* Hapus 'hidden sm:block' agar tampil di HP */}
          <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
            RUMI-SYNC
          </div>
        </Link>

        {/* Digabungkan antara mobile & desktop agar Notifikasi berfungsi di keduanya */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-green-500 text-xl">🟢</span>
            <span className="text-sm">Online</span>
          </div>
          <BatteryIndicator level={batteryLevel} />
          
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-[280px] sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notif.type === "warning" ? "bg-yellow-500" : "bg-green-500"
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200 bg-white rounded-b-lg">
                  <button className="text-sm text-green-600 hover:text-green-700">Lihat Semua</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Ubah efek aktif ke hijau */}
      <nav className="bg-white border-t border-gray-200 px-2 sm:px-4 py-2 sticky bottom-0" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          <Link to="/" className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${isActive("/") ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <Home className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-xs">Beranda</span>
          </Link>

          <Link to="/medical" className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${isActive("/medical") ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <Activity className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-xs">Pantau Medis</span>
          </Link>

          <Link to="/eco-nutrition" className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${isActive("/eco-nutrition") ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <Leaf className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-xs">Eco-Nutrisi</span>
          </Link>

          <Link to="/system-control" className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${isActive("/system-control") ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <Settings className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-xs">Kontrol Sistem</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}