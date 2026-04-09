import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CattleData {
  id: string;
  name: string;
  breed: string;
  temp: string;
  chewing: string;
  status: "normal" | "warning";
  health: number;
  age: { year: number; month: number; day: number };
  gender: "Jantan" | "Betina";
  methaneLevel: number;
  rumination: {
    status: string;
    frequency: string;
    duration: string;
    intensity: string;
    metanePotential: string;
    feedType: string;
    recommendation: string;
    targetMethane: string;
    feedBoost: string;
    ruminalHealth: string;
  };
}

export interface AppNotification {
  id: number;
  type: "warning" | "info" | "success";
  message: string;
  time: string;
  cattleId?: string;
  isRead: boolean;
}

const breeds = ["Brahman Cross", "Limosin", "Ongole", "Simental", "Bali", "Madura", "Holstein"];

const generateMockCattle = (): CattleData[] => {
  return Array.from({ length: 60 }).map((_, i) => {
    const idNum = (i + 1).toString().padStart(3, '0');
    const id = `ID-${idNum}`;
    const name = `Sapi Lokal - ${idNum}`;
    const breed = breeds[i % breeds.length];
    const gender = i % 3 === 0 ? "Jantan" : "Betina";
    
    // Simulate some logic for status distribution
    const rand = Math.random();
    let tempValue: number;
    let health: number;
    let status: "normal" | "warning";
    let ruminationStatus: string;
    let frequency: number;
    
    if (rand < 0.15) {
      // Danger (15%)
      tempValue = 39.5 + Math.random() * 1.5; // 39.5 - 41.0
      health = 60 + Math.floor(Math.random() * 15);
      status = "warning";
      ruminationStatus = "Penurunan Drastis";
      frequency = 30 + Math.floor(Math.random() * 15);
    } else if (rand < 0.35) {
      // Warning (20%)
      tempValue = 39.1 + Math.random() * 0.3; // 39.1 - 39.4
      health = 80 + Math.floor(Math.random() * 10);
      status = "warning";
      ruminationStatus = "Kunyahan Lambat";
      frequency = 40 + Math.floor(Math.random() * 15);
    } else {
      // Normal (65%)
      tempValue = 38.0 + Math.random() * 1.0; // 38.0 - 39.0
      health = 90 + Math.floor(Math.random() * 10);
      status = "normal";
      ruminationStatus = "Normal Terkendali";
      frequency = 55 + Math.floor(Math.random() * 10);
    }

    return {
      id,
      name,
      breed,
      temp: tempValue.toFixed(1),
      chewing: `${frequency}x/menit`,
      status,
      health,
      age: { 
        year: 1 + Math.floor(Math.random() * 4), 
        month: Math.floor(Math.random() * 11), 
        day: 1 + Math.floor(Math.random() * 28) 
      },
      gender,
      methaneLevel: 90 + Math.floor(Math.random() * 70),
      rumination: {
        status: ruminationStatus,
        frequency: `${frequency}x/mnt`,
        duration: `${(3 + Math.random() * 2).toFixed(1)} detik`,
        intensity: health > 85 ? "Sedang" : "Tinggi",
        metanePotential: health > 85 ? "Level Normal" : "Tinggi",
        feedType: health > 85 ? "Rumput Segar" : "Jerami Kering",
        recommendation: health > 85 ? "Pakan cukup optimal. Pertahankan." : "Tingkatkan pakan bernutrisi tinggi segera.",
        targetMethane: "110g/hari",
        feedBoost: "+5%",
        ruminalHealth: health > 85 ? "Sangat Baik" : "Perlu Pemeriksaan"
      }
    };
  });
};

const mockCattleData = generateMockCattle();

const LS_KEY = 'rumisync_cattle_v1';
const LS_NOTIF_KEY = 'rumisync_notif_v1';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

const mockNotifications: AppNotification[] = [
  { id: 1, type: "warning", message: "ID-005: Suhu meningkat pesat - Indikasi Demam", time: "10 menit lalu", cattleId: "ID-005", isRead: false },
  { id: 2, type: "warning", message: "ID-012: Kunyahan menurun - Perlu pantauan", time: "25 menit lalu", cattleId: "ID-012", isRead: false },
  { id: 3, type: "info", message: "RUMI-SYNC berhasil memindai 30 sapi pada base utama", time: "1 jam lalu", isRead: true },
];

interface CattleContextType {
  cattleData: CattleData[];
  selectedCattleId: string;
  setSelectedCattleId: (id: string) => void;
  selectedCattle: CattleData;
  addCattle: (newCow: CattleData) => void;
  updateCattle: (id: string, updatedCow: Partial<CattleData>) => void;
  deleteCattle: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: number) => void;
  addNotification: (notif: Omit<AppNotification, "id" | "isRead">) => void;
}

const CattleContext = createContext<CattleContextType | undefined>(undefined);

export function CattleProvider({ children }: { children: ReactNode }) {
  const [cattleData, setCattleData] = useState<CattleData[]>(() => loadFromStorage(LS_KEY, mockCattleData));
  const [selectedCattleId, setSelectedCattleId] = useState<string>(() => {
    const data = loadFromStorage<CattleData[]>(LS_KEY, mockCattleData);
    return data[0]?.id || mockCattleData[0].id;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage(LS_NOTIF_KEY, mockNotifications));

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(cattleData)); } catch {}
  }, [cattleData]);

  useEffect(() => {
    try { localStorage.setItem(LS_NOTIF_KEY, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  const selectedCattle = cattleData.find(c => c.id === selectedCattleId) || cattleData[0];

  const addCattle = (newCow: CattleData) => {
    setCattleData(prev => [newCow, ...prev]);
  };

  const updateCattle = (id: string, updatedData: Partial<CattleData>) => {
    setCattleData(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCattle = (id: string) => {
    setCattleData(prev => prev.filter(c => c.id !== id));
  };

  const addNotification = (notif: Omit<AppNotification, "id" | "isRead">) => {
    const newNotif: AppNotification = { ...notif, id: Date.now(), isRead: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <CattleContext.Provider value={{
      cattleData,
      selectedCattleId,
      setSelectedCattleId,
      selectedCattle,
      addCattle,
      updateCattle,
      deleteCattle,
      notifications,
      markNotificationAsRead,
      addNotification
    }}>
      {children}
    </CattleContext.Provider>
  );
}

export function useCattle() {
  const context = useContext(CattleContext);
  if (context === undefined) {
    throw new Error('useCattle must be used within a CattleProvider');
  }
  return context;
}
