import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Leaf, ChevronLeft, ChevronRight, Sparkles, FlaskConical, CheckCircle2, Flame } from "lucide-react";
import { useCattle } from "../context/CattleContext";

// ─── Data Definitions ──────────────────────────────────────────────────────
const SERAT_OPTIONS = [
  { id: 'jerami_padi', label: 'Jerami Padi / Silase Jerami Padi', methaneFactor: 1.80 },
  { id: 'pucuk_tebu', label: 'Pucuk Tebu / Silase Pucuk Tebu', methaneFactor: 1.65 },
  { id: 'pelepah_sawit', label: 'Pelepah Sawit / Silase Pelepah Sawit', methaneFactor: 1.55 },
  { id: 'jerami_jagung', label: 'Jerami Jagung (Tebon)', methaneFactor: 1.42 },
  { id: 'rumput_gajah', label: 'Rumput Gajah / Odot / Lapangan', methaneFactor: 1.25 },
];

const PATI_OPTIONS = [
  { id: 'bis', label: 'Bungkil Inti Sawit (BIS)', methaneFactor: 0.72 },
  { id: 'jagung', label: 'Jagung Giling / Silase Jagung', methaneFactor: 0.65 },
  { id: 'dedak', label: 'Dedak Padi / Bekatul', methaneFactor: 0.78 },
  { id: 'pollard', label: 'Pollard Gandum', methaneFactor: 0.80 },
];

const PROTEIN_OPTIONS = [
  { id: 'none', label: ' Tidak Ada (Opsional) ', reduction: 0 },
  { id: 'gamal', label: 'Daun Gamal', reduction: 0.12 },
  { id: 'indigofera', label: 'Indigofera sp.', reduction: 0.15 },
  { id: 'lamtoro', label: 'Daun Lamtoro / Kaliandra', reduction: 0.10 },
  { id: 'alfalfa', label: 'Alfalfa', reduction: 0.14 },
  { id: 'bungkil_kopra', label: 'Bungkil Kopra', reduction: 0.08 },
];

const ECO_BOOSTERS = [
  { id: 'minyak_kelapa', label: 'Minyak Kelapa', category: 'Minyak & Lemak (Lipida)', reduction: 0.15, icon: '🥥' },
  { id: 'minyak_bunga', label: 'Minyak Bunga Matahari', category: 'Minyak & Lemak (Lipida)', reduction: 0.18, icon: '🌻' },
  { id: 'minyak_ikan', label: 'Minyak Ikan', category: 'Minyak & Lemak (Lipida)', reduction: 0.20, icon: '🐟' },
  { id: 'minyak_zaitun', label: 'Minyak Zaitun', category: 'Minyak & Lemak (Lipida)', reduction: 0.16, icon: '🫒' },
  { id: 'lerak', label: 'Buah Lerak', category: 'Saponin & Tanin', reduction: 0.16, icon: '🫐' },
  { id: 'akasia', label: 'Daun Akasia / Daun Sepatu', category: 'Saponin & Tanin', reduction: 0.19, icon: '🌿' },
  { id: 'biji_anggur', label: 'Tepung Biji Anggur', category: 'Saponin & Tanin', reduction: 0.15, icon: '🍇' },
  { id: 'peppermint', label: 'Minyak Peppermint', category: 'Minyak Atsiri', reduction: 0.25, icon: '🌱' },
  { id: 'bawang_putih', label: 'Minyak Bawang Putih', category: 'Minyak Atsiri', reduction: 0.30, icon: '🧄' },
  { id: 'cengkeh', label: 'Minyak Cengkeh', category: 'Minyak Atsiri', reduction: 0.22, icon: '🌰' },
  { id: 'origanum', label: 'Minyak Origanum', category: 'Minyak Atsiri', reduction: 0.28, icon: '🌾' },
  { id: 'kayuputih', label: 'Minyak Kayu Putih', category: 'Minyak Atsiri', reduction: 0.20, icon: '🌲' },
];

const BASE_METHANE = 150;
const MAX_METHANE = 270;

function calcMethane(seratId: string, patiId: string, proteinId: string, ratio: number, boosterId: string | null): number {
  const serat = SERAT_OPTIONS.find(s => s.id === seratId);
  const pati = PATI_OPTIONS.find(p => p.id === patiId);
  const protein = PROTEIN_OPTIONS.find(pr => pr.id === proteinId);
  const booster = boosterId ? ECO_BOOSTERS.find(b => b.id === boosterId) : null;
  if (!serat || !pati) return BASE_METHANE;
  const blendedFactor = serat.methaneFactor * (ratio / 100) + pati.methaneFactor * ((100 - ratio) / 100);
  let m = BASE_METHANE * blendedFactor;
  if (protein && protein.reduction > 0) m *= (1 - protein.reduction);
  if (booster) m *= (1 - booster.reduction);
  return Math.round(Math.min(MAX_METHANE, Math.max(45, m)));
}

function getMethaneZone(v: number) {
  if (v < 110) return { label: '✅ Zona Hijau — Emisi Rendah', color: '#4c7766', bg: '#e2f0ea', border: '#a7f3d0', zone: 'green' };
  if (v < 175) return { label: '⚠️ Zona Kuning — Emisi Sedang', color: '#d97706', bg: '#fef3c7', border: '#fde68a', zone: 'yellow' };
  return { label: '🔴 Zona Merah — Emisi Tinggi', color: '#c25944', bg: '#fee2e2', border: '#fca5a5', zone: 'red' };
}

function genAI(seratId: string, patiId: string, proteinId: string, ratio: number, methane: number) {
  const z = methane < 110 ? 'green' : methane < 175 ? 'yellow' : 'red';
  const s = SERAT_OPTIONS.find(x => x.id === seratId);
  const p = PATI_OPTIONS.find(x => x.id === patiId);
  const pr = PROTEIN_OPTIONS.find(x => x.id === proteinId);
  if (z === 'green') return {
    statusType: 'success' as const,
    status: 'Nutrisi seimbang tercapai! 🎉',
    action: `Rasio ${s?.label.split('/')[0].trim()} ${ratio}% dan ${p?.label.split('/')[0].trim()} ${100 - ratio}% sudah sangat ideal.${pr?.id !== 'none' ? ` Penambahan ${pr?.label} memaksimalkan efisiensi rumen.` : ' Tambahkan protein (Kat. 3) untuk hasil lebih optimal.'}`,
    suggestion: 'Pertahankan rasio ini. Terapkan ke seluruh Rel agar seluruh kandang mencapai standar emisi rendah.',
    showBooster: false,
  };
  if (z === 'yellow') return {
    statusType: 'warning' as const,
    status: `Emisi Metana Zona Kuning — Perlu Optimasi`,
    action: `Porsi ${s?.label.split('/')[0].trim()} cukup tinggi (${ratio}%). Geser rasio pati ke ${Math.min(65, 100 - ratio + 15)}% agar propionat meningkat.${pr?.id === 'none' ? ' Tambahkan protein hijau seperti Daun Gamal untuk mempercepat penurunan.' : ''}`,
    suggestion: 'Eco-Booster direkomendasikan untuk mendorong ke Zona Hijau.',
    showBooster: true,
  };
  return {
    statusType: 'danger' as const,
    status: `🚨 Zona Merah! Emisi Sangat Tinggi (${methane}g/hari)`,
    action: `Porsi ${s?.label.split('/')[0].trim()} terlalu tinggi (${ratio}%). Geser ke minimal ${Math.max(10, ratio - 25)}% Pati atau ganti bahan serat ke Rumput Gajah.${pr?.id === 'none' ? ' Tambahkan protein leguminosa SEGERA.' : ''}`,
    suggestion: 'Terapkan Eco-Booster Lipida atau Minyak Atsiri untuk menekan populasi mikroba metanogen di rumen.',
    showBooster: true,
  };
}

// ─── Speedometer SVG coords (center = 100,105 radius = 90) ─────────────────
// Zone boundaries: 0g=180°, 110g≈107°, 175g≈54°, 270g=0°
// Points: (10,105), (72.3,19.4), (152.9,32.2), (190,105)
function needleRotation(v: number): number {
  return -90 + (v / MAX_METHANE) * 180;
}

export function EcoNutrition() {
  const { cattleData, selectedCattleId, setSelectedCattleId } = useCattle();

  // Rel batches — same as tracker (10 per batch)
  const batches = useMemo(() => {
    const sorted = [...cattleData].sort((a, b) => {
      const nA = parseInt(a.id.match(/\d+/)?.[0] || '0');
      const nB = parseInt(b.id.match(/\d+/)?.[0] || '0');
      return nA - nB;
    });
    const res: { label: string; cattle: typeof sorted }[] = [];
    for (let i = 0; i < sorted.length; i += 10) {
      const slice = sorted.slice(i, i + 10);
      res.push({ label: `Rel ${res.length + 1} — ${slice[0].id} hingga ${slice[slice.length - 1].id}`, cattle: slice });
    }
    return res;
  }, [cattleData]);

  const [relIdx, setRelIdx] = useState(0);
  const [seratId, setSeratId] = useState(SERAT_OPTIONS[0].id);
  const [patiId, setPatiId] = useState(PATI_OPTIONS[0].id);
  const [proteinId, setProteinId] = useState('none');
  const [ratio, setRatio] = useState(60);
  const [boosterId, setBoosterId] = useState<string | null>(null);

  const methane = useMemo(() => calcMethane(seratId, patiId, proteinId, ratio, boosterId), [seratId, patiId, proteinId, ratio, boosterId]);
  const zone = getMethaneZone(methane);
  const ai = useMemo(() => genAI(seratId, patiId, proteinId, ratio, methane), [seratId, patiId, proteinId, ratio, methane]);
  const rotation = needleRotation(methane);

  const currentRel = batches[Math.min(relIdx, batches.length - 1)];

  const boosterCats = ECO_BOOSTERS.reduce((acc, b) => {
    if (!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;
  }, {} as Record<string, typeof ECO_BOOSTERS>);

  const baseSeratMethane = BASE_METHANE * (SERAT_OPTIONS.find(s => s.id === seratId)?.methaneFactor ?? 1);
  const reductionPct = Math.max(0, Math.round((baseSeratMethane - methane) / baseSeratMethane * 100));

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 text-center md:text-left">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rs-primary rounded-xl flex items-center justify-center shadow-lg text-white shrink-0">
          <Leaf className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rs-text">Eco-Nutrisi & Carbon Tracker</h1>
          <p className="text-xs sm:text-sm text-rs-muted">Formulasi Pakan Cerdas — Tekan Emisi Metana Rumen</p>
        </div>
      </div>

      {/* REL SELECTOR */}
      <div className="bg-rs-card rounded-2xl border border-rs-border shadow-sm p-4">
        <div className="text-xs font-bold text-rs-muted uppercase tracking-widest mb-3">📍 Pilih Target Rel Analisis</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setRelIdx(i => Math.max(0, i - 1))} disabled={relIdx === 0}
            className="w-10 h-10 rounded-xl bg-rs-sage-light border border-rs-border flex items-center justify-center text-rs-primary disabled:opacity-30 hover:bg-rs-border transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-rs-sage-light border-2 border-rs-primary/30 rounded-xl px-4 py-2.5 text-center">
            <div className="font-bold text-rs-primary text-sm sm:text-base">{currentRel?.label ?? '—'}</div>
            <div className="text-xs text-rs-muted">{currentRel?.cattle.length ?? 0} ekor sapi</div>
          </div>
          <button onClick={() => setRelIdx(i => Math.min(batches.length - 1, i + 1))} disabled={relIdx >= batches.length - 1}
            className="w-10 h-10 rounded-xl bg-rs-sage-light border border-rs-border flex items-center justify-center text-rs-primary disabled:opacity-30 hover:bg-rs-border transition-colors shrink-0">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {currentRel && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {currentRel.cattle.map(c => (
              <button key={c.id} onClick={() => setSelectedCattleId(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${selectedCattleId === c.id ? 'bg-rs-primary text-white border-rs-primary' : 'bg-rs-sage-light text-rs-text border-rs-border hover:border-rs-sage'}`}>
                {c.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ZONE 1 + ZONE 2 — Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

        {/* ZONE 1: Feed Inputs */}
        <div className="bg-rs-card rounded-2xl border border-rs-border shadow-sm overflow-hidden">
          <div className="bg-rs-sage-light border-b border-rs-border px-4 sm:px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rs-primary/10 rounded-xl"><Leaf className="w-4 h-4 text-rs-primary" /></div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-rs-text">Pilih Bahan Baku Pakan</h2>
                <p className="text-xs text-rs-muted">Kombinasikan 2–3 bahan untuk formulasi optimal</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Kat 1: Serat */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-rs-text mb-1">
                <span>🌾</span> Sumber Serat Kasar
              </label>

              <select value={seratId} onChange={e => setSeratId(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-rs-card-sub border-2 border-rs-border rounded-xl focus:outline-none focus:border-rs-primary transition-all text-rs-text text-sm appearance-none">
                {SERAT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <p className="mt-1 text-xs text-rs-muted italic">{SERAT_OPTIONS.find(s => s.id === seratId)?.desc}</p>
            </div>

            {/* Kat 2: Pati */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-rs-text mb-1">
                <span>🌽</span> Sumber Pati
              </label>

              <select value={patiId} onChange={e => setPatiId(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-rs-card-sub border-2 border-rs-border rounded-xl focus:outline-none focus:border-rs-primary transition-all text-rs-text text-sm appearance-none">
                {PATI_OPTIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <p className="mt-1 text-xs text-rs-muted italic">{PATI_OPTIONS.find(p => p.id === patiId)?.desc}</p>
            </div>

            {/* Kat 3: Protein (Optional) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-rs-text mb-1">
                <span>🌿</span> Sumber Protein
              </label>

              <select value={proteinId} onChange={e => setProteinId(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] bg-rs-card-sub border-2 border-rs-border rounded-xl focus:outline-none focus:border-rs-primary transition-all text-rs-text text-sm appearance-none">
                {PROTEIN_OPTIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              {proteinId !== 'none' && <p className="mt-1 text-xs text-rs-muted italic">{PROTEIN_OPTIONS.find(p => p.id === proteinId)?.desc}</p>}
            </div>

            {/* Slider */}
            <div>
              <div className="text-xs font-bold text-rs-text mb-2">⚖️ Timbangan Rasio Pakan</div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700">🌾 Serat {ratio}%</span>
                <span className="px-2 py-1 rounded-lg bg-[#e2f0ea] border border-[#c1d1c8] text-[#4c7766]">🌽 Pati {100 - ratio}%</span>
              </div>
              <input type="range" min={10} max={90} value={ratio}
                onChange={e => setRatio(Number(e.target.value))}
                className="w-full h-3 rounded-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #f97316 ${ratio}%, #4c7766 ${ratio}%)`, accentColor: '#4c7766' }} />
              <div className="flex justify-between text-xs text-rs-muted mt-1">
                <span>Dominan Serat</span><span>Dominan Pati</span>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 2: Speedometer */}
        <div className="bg-rs-card rounded-2xl border border-rs-border shadow-sm overflow-hidden">
          <div className="bg-rs-sage-light border-b border-rs-border px-4 sm:px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rs-primary/10 rounded-xl"><Flame className="w-4 h-4 text-rs-primary" /></div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-rs-text">Monitor Emisi Metana</h2>
                <p className="text-xs text-rs-muted">Indikator berubah real-time saat slider digeser</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col items-center">
            {/* Fixed SVG Speedometer — pivot always at (100,105) */}
            <div className="w-full max-w-[280px] mx-auto">
              <svg viewBox="0 0 200 115" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
                {/* Zone arcs */}
                <path d="M 10 105 A 90 90 0 0 1 72.3 19.4" fill="none" stroke="#d1fae5" strokeWidth="20" strokeLinecap="butt" />
                <path d="M 72.3 19.4 A 90 90 0 0 1 152.9 32.2" fill="none" stroke="#fef3c7" strokeWidth="20" strokeLinecap="butt" />
                <path d="M 152.9 32.2 A 90 90 0 0 1 190 105" fill="none" stroke="#fee2e2" strokeWidth="20" strokeLinecap="butt" />
                {/* Zone labels */}
                <text x="8" y="112" fill="#6b8e7b" fontSize="7.5" fontWeight="bold" textAnchor="middle">0</text>
                <text x="50" y="26" fill="#4c7766" fontSize="7.5" fontWeight="bold" textAnchor="middle">110</text>
                <text x="160" y="22" fill="#d97706" fontSize="7.5" fontWeight="bold" textAnchor="middle">175</text>
                <text x="193" y="112" fill="#c25944" fontSize="7.5" fontWeight="bold" textAnchor="middle">270</text>
                <text x="100" y="8" fill="#6b8e7b" fontSize="7" fontWeight="bold" textAnchor="middle">g/hari</text>
                {/* Needle — transform in SVG so it's identical on all devices */}
                <g transform={`translate(100, 105) rotate(${rotation})`}>
                  <path d="M -3 6 L 0 -80 L 3 6 Z" fill="#2d3a33" />
                  <circle cx="0" cy="0" r="9" fill="#2d3a33" />
                  <circle cx="0" cy="0" r="4" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Value */}
            <motion.div key={methane} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-4xl sm:text-5xl font-black text-rs-text text-center mt-2">
              {methane}
            </motion.div>
            <div className="text-xs text-rs-muted mt-1">g metana / hari / ekor</div>
            <div className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold border inline-block text-center"
              style={{ backgroundColor: zone.bg, color: zone.color, borderColor: zone.border }}>
              {zone.label}
            </div>

            {/* Sensor validation */}
            <div className="mt-4 w-full bg-rs-sage-light border border-rs-border rounded-xl p-3 flex items-start gap-2.5">
              <span className="text-lg shrink-0">🎙️</span>
              <div>
                <div className="text-[10px] font-bold text-rs-muted uppercase tracking-wider mb-0.5">Validasi Sensor (KY-038)</div>
                <div className="text-xs font-semibold text-rs-text">
                  {currentRel?.cattle[0]?.id ?? 'ID'}: {methane > 175 ? 'Kunyahan Sangat Berat — Fermentasi Tinggi' : methane > 110 ? 'Kunyahan Sedang — Perlu Pemantauan' : 'Kunyahan Ringan & Efisien — Fermentasi Optimal'}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-3 grid grid-cols-2 gap-2 w-full">
              <div className="bg-rs-sage-light rounded-xl p-3 border border-rs-border">
                <div className="text-xs text-rs-muted">Porsi Serat</div>
                <div className="text-sm font-bold text-rs-text">{ratio}%</div>
              </div>
              <div className="bg-rs-sage-light rounded-xl p-3 border border-rs-border">
                <div className="text-xs text-rs-muted">Estimasi Reduksi</div>
                <div className="text-sm font-bold text-rs-primary">{reductionPct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3: AI Recipe */}
      <div className="bg-rs-card rounded-2xl border border-rs-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-rs-primary to-[#3f6355] px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl"><Sparkles className="w-4 h-4 text-white" /></div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Resep AI — Analisis Pakan Real-Time</h2>
              <p className="text-xs text-white/70">Output berubah otomatis saat Anda mengubah bahan atau slider</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Status */}
          <div className={`rounded-xl p-4 border`}
            style={{ backgroundColor: ai.statusType === 'success' ? '#e2f0ea' : ai.statusType === 'warning' ? '#fef3c7' : '#fee2e2', borderColor: ai.statusType === 'success' ? '#a7f3d0' : ai.statusType === 'warning' ? '#fde68a' : '#fca5a5' }}>
            <div className="font-bold text-sm mb-1.5"
              style={{ color: ai.statusType === 'success' ? '#065f46' : ai.statusType === 'warning' ? '#92400e' : '#991b1b' }}>
              {ai.status}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed"
              style={{ color: ai.statusType === 'success' ? '#047857' : ai.statusType === 'warning' ? '#b45309' : '#b91c1c' }}>
              {ai.action}
            </p>
          </div>

          {/* Suggestion */}
          <div className="bg-rs-sage-light border border-rs-border rounded-xl p-4 flex gap-3">
            <span className="text-lg shrink-0">💡</span>
            <div>
              <div className="text-xs font-bold text-rs-muted uppercase tracking-wider mb-1">Saran Tindakan AI</div>
              <p className="text-xs sm:text-sm text-rs-text leading-relaxed">{ai.suggestion}</p>
            </div>
          </div>

          {/* Eco-Boosters */}
          {ai.showBooster && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4 text-rs-primary" />
                <span className="text-sm font-bold text-rs-text">🧪 Katalog Eco-Booster (Saran AI)</span>
                {boosterId && <button onClick={() => setBoosterId(null)} className="ml-auto text-xs text-rs-sage hover:text-rs-primary font-bold">Reset</button>}
              </div>
              <p className="text-xs text-rs-muted mb-3">Bahan-bahan ini terbukti melumpuhkan mikroba metanogen di dalam rumen sapi.</p>
              <div className="space-y-3">
                {Object.entries(boosterCats).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="text-xs font-bold text-rs-muted uppercase tracking-wider mb-2">{cat}</div>
                    <div className="flex flex-wrap gap-2">
                      {items.map(b => (
                        <button key={b.id} onClick={() => setBoosterId(boosterId === b.id ? null : b.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${boosterId === b.id ? 'bg-rs-primary text-white border-rs-primary' : 'bg-rs-sage-light text-rs-text border-rs-border hover:border-rs-sage'}`}>
                          {b.icon} {b.label}
                          <span className={`ml-1 ${boosterId === b.id ? 'text-white/80' : 'text-rs-sage'}`}>-{Math.round(b.reduction * 100)}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {boosterId && (
                <div className="mt-3 bg-[#e2f0ea] border border-[#a7f3d0] rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                  <span className="text-xs text-[#047857] font-bold">
                    Eco-Booster aktif! Metana turun ke {methane}g/hari — {ECO_BOOSTERS.find(b => b.id === boosterId)?.label}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Apply to All */}
          {ai.statusType === 'success' && currentRel && (
            <button className="w-full bg-rs-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#3f6355] transition-colors flex items-center justify-center gap-2 shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              Terapkan Resep Ini ke Seluruh {currentRel.label} ({currentRel.cattle.length} Sapi)
            </button>
          )}

          {/* Environmental Impact */}
          <div className="bg-rs-border border border-rs-sage/30 rounded-xl p-4 flex gap-3">
            <span className="text-2xl shrink-0">🌍</span>
            <div className="text-xs sm:text-sm text-rs-text">
              <span className="font-bold block mb-0.5">Dampak Lingkungan Positif</span>
              Formulasi ini setara mengurangi emisi CO₂ <strong>{Math.max(1, Math.round((MAX_METHANE - methane) / 10))} km</strong> perjalanan mobil per hari per ekor.
              {currentRel && <span className="block text-rs-sage mt-0.5"> Total untuk Rel ini: <strong className="text-rs-primary">{Math.round((MAX_METHANE - methane) / 10 * currentRel.cattle.length)} km equiv.</strong></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
