import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── SVG ICON ────────────────────────────────────────────────────────────────
const I = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const P = {
  brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  bar: "M18 20V10 M12 20V4 M6 20v-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  trend: "M23 6l-9.5 9.5-5-5L1 18",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  warn: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  arrowUpR: "M7 17l9.2-9.2M17 17V7H7",
  arrowDnR: "M7 7l9.2 9.2M7 7v10h10",
  wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4z",
  act: "M22 12h-4l-3 9L9 3l-3 9H2",
  check: "M20 6L9 17l-5-5",
  chev: "M6 9l6 6 6-6",
  spin: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01",
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const MONTHLY = [
  { month: "Jan", income: 6700, expenses: 4190, savings: 2510 },
  { month: "Feb", income: 6300, expenses: 3583, savings: 2717 },
  { month: "Mar", income: 7000, expenses: 7127, savings: -127 },
  { month: "Apr", income: 6800, expenses: 4250, savings: 2550 },
  { month: "May", income: 7200, expenses: 4890, savings: 2310 },
];
const CATS = [
  { name: "Housing", value: 5400, pct: 36.2 },
  { name: "Health", value: 4150, pct: 27.9 },
  { name: "Groceries", value: 1100, pct: 7.4 },
  { name: "Entertainment", value: 1077, pct: 7.2 },
  { name: "Shopping", value: 891, pct: 6.0 },
  { name: "Transport", value: 484, pct: 3.3 },
  { name: "Utilities", value: 640, pct: 4.3 },
  { name: "Dining", value: 506, pct: 3.4 },
];
const ANOMALIES = [
  { date: "Mar 22", desc: "Medical Bill", amt: 3500, cat: "Health", score: -0.104 },
  { date: "Jan 25", desc: "Apple Store", amt: 999, cat: "Entertainment", score: -0.041 },
  { date: "Feb 22", desc: "Casino Night", amt: 450, cat: "Misc", score: -0.038 },
  { date: "Mar 29", desc: "Gym Equipment", amt: 289, cat: "Health", score: -0.029 },
  { date: "Jan 22", desc: "ATM Withdrawal", amt: 200, cat: "Misc", score: -0.021 },
];
const ADVICE = [
  { lv: "GOOD", col: "#22c55e", title: "Savings Rate 26.3%", msg: "Averaging ~$1,700/month saved.", action: "Invest surplus into index funds or boost 401k." },
  { lv: "WARN", col: "#f59e0b", title: "Risk Score 46.5/100", msg: "Moderate risk: high-variance months detected.", action: "Track weekly. Stabilize monthly budget." },
  { lv: "WARN", col: "#f59e0b", title: "Housing 36.2%", msg: "Above recommended 30% of total expenses.", action: "Explore refinancing or a roommate." },
  { lv: "ALERT", col: "#ef4444", title: "7 Anomalies Detected", msg: "$4,933 in unusual transactions flagged by AI.", action: "Set bank alerts above your normal range." },
  { lv: "TIP", col: "#818cf8", title: "Emergency Fund", msg: "Target 3–6 months of expenses in liquid savings.", action: "Goal: $14,900–$29,800 based on monthly spend." },
];
const PIECOLS = ["#8B0000", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#6b0000", "#3f0000"];
const NAV = [
  { key: "dashboard", icon: "home", label: "Dashboard" },
  { key: "analytics", icon: "bar", label: "Analytics" },
  { key: "risk", icon: "shield", label: "Risk Analysis" },
  { key: "forecast", icon: "trend", label: "Forecast" },
  { key: "reports", icon: "file", label: "Reports" },
  { key: "settings", icon: "gear", label: "Settings" },
];

// Analytics page data
const WEEKLY = [
  { week: "W1", spend: 890, txns: 12 }, { week: "W2", spend: 1240, txns: 18 },
  { week: "W3", spend: 760, txns: 9 }, { week: "W4", spend: 1100, txns: 15 },
  { week: "W5", spend: 980, txns: 11 }, { week: "W6", spend: 1450, txns: 22 },
  { week: "W7", spend: 830, txns: 10 }, { week: "W8", spend: 1120, txns: 16 },
];
const DAILY_PATTERN = [
  { day: "Mon", avg: 145 }, { day: "Tue", avg: 98 }, { day: "Wed", avg: 210 },
  { day: "Thu", avg: 167 }, { day: "Fri", avg: 320 }, { day: "Sat", avg: 445 }, { day: "Sun", avg: 280 },
];

// Risk page data
const RISK_RADAR = [
  { subject: "Savings", A: 74, fullMark: 100 },
  { subject: "Stability", A: 58, fullMark: 100 },
  { subject: "Liquidity", A: 65, fullMark: 100 },
  { subject: "Diversity", A: 42, fullMark: 100 },
  { subject: "Debt Load", A: 80, fullMark: 100 },
  { subject: "Emergency", A: 35, fullMark: 100 },
];
const RISK_HISTORY = [
  { month: "Nov", score: 38 }, { month: "Dec", score: 42 }, { month: "Jan", score: 51 },
  { month: "Feb", score: 44 }, { month: "Mar", score: 68 }, { month: "Apr", score: 53 }, { month: "May", score: 46 },
];

// Forecast page data
const FORECAST_DATA = [
  { month: "Jan", actual: 4190, predicted: null },
  { month: "Feb", actual: 3583, predicted: null },
  { month: "Mar", actual: 7127, predicted: null },
  { month: "Apr", actual: 4250, predicted: null },
  { month: "May", actual: 4890, predicted: null },
  { month: "Jun", actual: null, predicted: 5281, upper: 6073, lower: 4489 },
  { month: "Jul", actual: null, predicted: 5540, upper: 6370, lower: 4710 },
  { month: "Aug", actual: null, predicted: 5820, upper: 6693, lower: 4947 },
];
const CAT_FORECAST = [
  { name: "Housing", current: 1800, forecast: 1800, change: 0 },
  { name: "Health", current: 890, forecast: 1240, change: 39.3 },
  { name: "Groceries", current: 92, forecast: 105, change: 14.1 },
  { name: "Entertainment", current: 340, forecast: 290, change: -14.7 },
  { name: "Shopping", current: 220, forecast: 310, change: 40.9 },
  { name: "Transport", current: 160, forecast: 175, change: 9.4 },
];

// Reports data
const TRANSACTIONS = [
  { date: "2024-03-22", desc: "Medical Bill", cat: "Health", amt: -3500, type: "debit" },
  { date: "2024-03-27", desc: "Freelance Income", cat: "Income", amt: 1500, type: "credit" },
  { date: "2024-03-15", desc: "Rent Payment", cat: "Housing", amt: -1800, type: "debit" },
  { date: "2024-03-05", desc: "Salary Deposit", cat: "Income", amt: 5500, type: "credit" },
  { date: "2024-03-06", desc: "Amazon Purchase", cat: "Shopping", amt: -199, type: "debit" },
  { date: "2024-03-20", desc: "Costco", cat: "Groceries", amt: -312, type: "debit" },
  { date: "2024-03-16", desc: "Electricity Bill", cat: "Utilities", amt: -125, type: "debit" },
  { date: "2024-03-10", desc: "Uber Ride", cat: "Transport", amt: -25, type: "debit" },
  { date: "2024-03-08", desc: "Starbucks", cat: "Dining", amt: -7, type: "debit" },
  { date: "2024-02-22", desc: "Casino Night", cat: "Misc", amt: -450, type: "debit" },
  { date: "2024-02-15", desc: "Rent Payment", cat: "Housing", amt: -1800, type: "debit" },
  { date: "2024-02-05", desc: "Salary Deposit", cat: "Income", amt: 5500, type: "credit" },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;overflow:hidden;}
body{background:#060608;color:#e8d4d4;font-family:'Rajdhani',sans-serif;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#8B0000;border-radius:4px;}
@keyframes pulseGlow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.4)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes scanY{0%{top:-1px}100%{top:100%}}
@keyframes rotateFull{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.pg{animation:pulseGlow 2s ease-in-out infinite}
.fy{animation:floatY 3s ease-in-out infinite}
.rot{animation:rotateFull .9s linear infinite}
.si{animation:slideIn .4s ease-out both}
input[type=range]{-webkit-appearance:none;appearance:none;background:rgba(139,0,0,0.2);height:4px;border-radius:4px;outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#ef4444;cursor:pointer;box-shadow:0 0 8px rgba(239,68,68,0.6);}
input[type=checkbox]{accent-color:#ef4444;}
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d");
    const pts = Array.from({ length: 38 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.1 + .2, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      a: Math.random() * .22 + .04
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,38,38,${p.a})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function Count({ to, prefix = "", suffix = "", dec = 0, dur = 1400 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - s) / dur, 1);
      setV((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(tick); else setV(to);
    };
    tick();
  }, [to, dur]);
  return <>{prefix}{v.toFixed(dec)}{suffix}</>;
}

function Gauge({ score }) {
  const R = 68, S = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { setTimeout(() => setOff(C * (1 - score / 100)), 250); }, [score, C]);
  const col = score < 35 ? "#22c55e" : score < 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: R * 2 + 18, height: R * 2 + 18 }}>
        <svg width={R * 2 + 18} height={R * 2 + 18} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={R + 9} cy={R + 9} r={R} fill="none" stroke="rgba(139,0,0,0.15)" strokeWidth={S} />
          <circle cx={R + 9} cy={R + 9} r={R} fill="none" stroke={col} strokeWidth={S} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={off}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 10px ${col})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 800, color: col, textShadow: `0 0 22px ${col}80`, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: col, marginTop: 3, opacity: .75 }}>
            {score < 35 ? "Low" : score < 60 ? "Moderate" : "High"} Risk
          </span>
        </div>
      </div>
    </div>
  );
}

function Card({ children, style = {}, glow = false, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, delay, ease: [.22, 1, .36, 1] }}
      whileHover={{ y: -2, transition: { duration: .12 } }}
      style={{
        background: "linear-gradient(145deg,rgba(18,2,2,.92),rgba(8,0,0,.96))",
        border: `1px solid ${glow ? "rgba(139,0,0,.35)" : "rgba(139,0,0,.18)"}`,
        borderRadius: 14, backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
        boxShadow: glow ? "0 0 0 1px rgba(139,0,0,.12),0 8px 40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,60,60,.07)" : "0 4px 20px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,60,60,.04)",
        ...style
      }}>
      {glow && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(139,0,0,.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 }} />}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </motion.div>
  );
}

const Lbl = ({ children }) => (
  <span style={{ fontSize: 9, color: "rgba(239,68,68,.55)", letterSpacing: ".2em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{children}</span>
);

function TT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(6,0,0,.97)", border: "1px solid rgba(139,0,0,.4)", borderRadius: 9, padding: "9px 13px", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>
      <div style={{ color: "#ef4444", marginBottom: 5, letterSpacing: ".15em", fontSize: 8, textTransform: "uppercase" }}>{label}</div>
      {payload.map((p, i) => p.value != null && (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "rgba(220,170,170,.65)", textTransform: "capitalize" }}>{p.name}:</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>{typeof p.value === "number" && p.name !== "score" ? `$${p.value.toLocaleString()}` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function PageHeader({ title, subtitle, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#8B0000,#4b0000)", boxShadow: "0 0 18px rgba(139,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <I d={P[icon]} size={19} color="#fca5a5" />
      </div>
      <div>
        <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 800, color: "#f5d0d0", letterSpacing: "-.01em" }}>{title}</h2>
        <div style={{ fontSize: 9, color: "rgba(239,68,68,.4)", letterSpacing: ".2em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(139,0,0,.4),transparent)", marginLeft: 16 }} />
    </div>
  );
}

function StatChip({ label, value, color = "#f5d0d0", up }) {
  return (
    <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.18)", textAlign: "center" }}>
      <div style={{ fontSize: 8, color: "rgba(239,68,68,.45)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color }}>{value}</span>
        {up !== undefined && (
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round">
            <path d={up ? P.arrowUpR : P.arrowDnR} />
          </svg>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  return (
    <div style={{ width: 196, flexShrink: 0, height: "100%", background: "linear-gradient(180deg,rgba(4,0,6,1) 0%,rgba(3,0,3,1) 100%)", borderRight: "1px solid rgba(139,0,0,.2)", display: "flex", flexDirection: "column", boxShadow: "3px 0 32px rgba(0,0,0,.7)" }}>
      <div style={{ padding: "22px 18px 15px", borderBottom: "1px solid rgba(139,0,0,.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, position: "relative", background: "linear-gradient(135deg,#8B0000,#4b0000)", boxShadow: "0 0 22px rgba(220,38,38,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I d={P.brain} size={19} color="#fca5a5" />
            <div className="pg" style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444", border: "2px solid #040006" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, color: "#f5d0d0" }}>FinAdvisor</div>
            <div style={{ fontSize: 8, color: "rgba(239,68,68,.45)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>AI Intelligence</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ key, icon, label }) => {
          const on = active === key;
          return (
            <motion.button key={key} whileHover={{ x: 3 }} whileTap={{ scale: .97 }} onClick={() => setActive(key)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left", width: "100%", background: on ? "linear-gradient(135deg,rgba(139,0,0,.32),rgba(75,0,0,.15))" : "transparent", borderLeft: on ? "2px solid #ef4444" : "2px solid transparent", boxShadow: on ? "0 0 18px rgba(139,0,0,.14),inset 0 1px 0 rgba(255,80,80,.05)" : "none", transition: "all .12s" }}>
              <I d={P[icon]} size={14} color={on ? "#ef4444" : "rgba(139,0,0,.45)"} />
              <span style={{ fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: on ? 600 : 500, color: on ? "#f5d0d0" : "rgba(180,80,80,.45)" }}>{label}</span>
            </motion.button>
          );
        })}
      </nav>
      <div style={{ margin: "0 8px 14px", padding: "10px", borderRadius: 10, background: "rgba(139,0,0,.07)", border: "1px solid rgba(139,0,0,.14)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: "linear-gradient(135deg,#8B0000,#4b0000)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fca5a5", fontFamily: "'JetBrains Mono',monospace" }}>AJ</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Rahul kafle</div>
            <div style={{ fontSize: 9, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace" }}>Premium Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ risk, onUpload, notifOpen, setNotifOpen }) {
  const rc = risk < 35 ? "#22c55e" : risk < 60 ? "#f59e0b" : "#ef4444";
  const rl = risk < 35 ? "Low" : risk < 60 ? "Moderate" : "High";
  return (
    <div style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(139,0,0,.14)", background: "rgba(4,0,6,.92)", backdropFilter: "blur(18px)", zIndex: 5 }}>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#f5d0d0" }}>
          Financial <span style={{ color: "#ef4444", textShadow: "0 0 18px rgba(239,68,68,.5)" }}>Advisory</span> Intelligence
        </div>
        <div style={{ fontSize: 8, color: "rgba(239,68,68,.38)", letterSpacing: ".22em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>Real-time AI-Powered Personal Finance Analysis</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {[{ l: "Avg Income", v: "$6,800", up: true }, { l: "Avg Expenses", v: "$4,990", up: false }, { l: "Savings", v: "$1,810", up: true }].map(({ l, v, up }) => (
          <div key={l} style={{ padding: "4px 11px", borderRadius: 7, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.17)" }}>
            <div style={{ fontSize: 7, color: "rgba(239,68,68,.4)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>{l}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0" }}>{v}</span>
              <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round"><path d={up ? P.arrowUpR : P.arrowDnR} /></svg>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 7, background: `${rc}14`, border: `1px solid ${rc}35` }}>
          <div className="pg" style={{ width: 6, height: 6, borderRadius: "50%", background: rc, boxShadow: `0 0 5px ${rc}`, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: rc }}>{rl} · {risk}</span>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 7, cursor: "pointer", background: "linear-gradient(135deg,#8B0000,#6b0000)", boxShadow: "0 0 18px rgba(139,0,0,.38)", border: "1px solid rgba(255,80,80,.18)", fontSize: 11, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, color: "#fca5a5" }}>
          <I d={P.upload} size={12} color="#fca5a5" /> Upload CSV
          <input type="file" accept=".csv" style={{ display: "none" }} onChange={onUpload} />
        </label>
        <div style={{ position: "relative" }}>
          <button onClick={() => setNotifOpen(o => !o)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(139,0,0,.26)", background: "rgba(139,0,0,.11)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <I d={P.bell} size={14} color="#ef4444" />
            <div className="pg" style={{ position: "absolute", top: 6, right: 6, width: 5, height: 5, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 5px #ef4444" }} />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 5, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: .96 }} transition={{ duration: .15 }}
                style={{ position: "absolute", right: 0, top: 40, width: 270, borderRadius: 11, zIndex: 99, background: "rgba(6,0,0,.98)", border: "1px solid rgba(139,0,0,.35)", boxShadow: "0 18px 50px rgba(0,0,0,.8)" }}>
                <div style={{ padding: "9px 13px", borderBottom: "1px solid rgba(139,0,0,.18)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0", fontWeight: 700, letterSpacing: ".1em" }}>ANOMALY ALERTS</div>
                {ANOMALIES.slice(0, 3).map((a, i) => (
                  <div key={i} style={{ padding: "8px 13px", borderBottom: "1px solid rgba(139,0,0,.09)", display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <I d={P.warn} size={11} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: 10, color: "#f5d0d0", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{a.desc}</div>
                      <div style={{ fontSize: 8, color: "rgba(239,68,68,.45)", marginTop: 1, fontFamily: "'JetBrains Mono',monospace" }}>${a.amt.toLocaleString()} · {a.date}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardPage({ monthly, advice, setAdvice }) {
  const avgInc = monthly.reduce((s, m) => s + m.income, 0) / monthly.length;
  const avgSav = monthly.reduce((s, m) => s + m.savings, 0) / monthly.length;
  const savRatio = ((avgSav / avgInc) * 100).toFixed(1);
  const forecast = Math.round((monthly[monthly.length - 1]?.expenses || 6500) * 1.08);
  const trendUp = forecast > (monthly[monthly.length - 2]?.expenses || 0);
  const RISK = 46;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(139,0,0,.5),transparent)" }} />
        <span style={{ fontSize: 8, color: "rgba(239,68,68,.35)", letterSpacing: ".3em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>Overview · Q1–Q2 2024</span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,rgba(139,0,0,.5))" }} />
      </div>

      {/* ROW 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "184px 1fr 184px", gap: 14, marginBottom: 14 }}>
        <Card glow delay={.05} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><I d={P.shield} size={12} color="#ef4444" /><Lbl>Risk Score</Lbl></div>
          <Gauge score={RISK} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 14 }}>
            {[["Volatility", "High"], ["Anomalies", "7"]].map(([k, v]) => (
              <div key={k} style={{ padding: "7px 8px", borderRadius: 7, textAlign: "center", background: "rgba(139,0,0,.1)", border: "1px solid rgba(139,0,0,.2)" }}>
                <div style={{ fontSize: 7, color: "rgba(239,68,68,.45)", textTransform: "uppercase", letterSpacing: ".12em", fontFamily: "'JetBrains Mono',monospace" }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0", marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={.1} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><I d={P.act} size={12} color="#ef4444" /><Lbl>Income vs Expenses</Lbl></div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["Income", "#22c55e"], ["Expenses", "#ef4444"], ["Savings", "#f59e0b"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: "rgba(220,120,120,.65)" }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={176}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <defs>
                {[["gi", "#22c55e"], ["ge", "#ef4444"], ["gs", "#f59e0b"]].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={.25} /><stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#gi)" dot={{ fill: "#22c55e", r: 2.5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#ge)" dot={{ fill: "#ef4444", r: 2.5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={2} fill="url(#gs)" dot={{ fill: "#f59e0b", r: 2.5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card glow delay={.15} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.wallet} size={12} color="#ef4444" /><Lbl>Savings Ratio</Lbl></div>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 38, fontWeight: 800, color: "#22c55e", lineHeight: 1, textShadow: "0 0 26px rgba(34,197,94,.4)" }}>
              <Count to={parseFloat(savRatio)} suffix="%" dec={1} dur={1600} />
            </div>
            <div style={{ fontSize: 8, color: "rgba(239,68,68,.38)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginTop: 5 }}>of income saved</div>
            <div style={{ margin: "12px 0 3px", height: 5, borderRadius: 99, background: "rgba(139,0,0,.17)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(parseFloat(savRatio), 100)}%` }} transition={{ duration: 1.6, delay: .4, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#8B0000,#22c55e)", boxShadow: "0 0 9px rgba(34,197,94,.4)" }} />
            </div>
          </div>
          {[["Monthly Avg", `$${Math.round(avgSav).toLocaleString()}`], ["Target", "$2,000+"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 9px", borderRadius: 7, background: "rgba(139,0,0,.07)", border: "1px solid rgba(139,0,0,.13)", marginTop: 5 }}>
              <span style={{ fontSize: 8, color: "rgba(239,68,68,.42)", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "'JetBrains Mono',monospace" }}>{k}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#22c55e" }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.1fr .9fr", gap: 14, marginBottom: 14 }}>
        <Card delay={.2} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.bar} size={12} color="#ef4444" /><Lbl>Spending Breakdown</Lbl></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: "0 0 155px" }}>
              <ResponsiveContainer width="100%" height={155}>
                <PieChart>
                  <Pie data={CATS} cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {CATS.map((_, i) => <Cell key={i} fill={PIECOLS[i % PIECOLS.length]} style={{ filter: i === 0 ? "drop-shadow(0 0 7px rgba(139,0,0,.7))" : "none" }} />)}
                  </Pie>
                  <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`]} contentStyle={{ background: "rgba(6,0,0,.96)", border: "1px solid rgba(139,0,0,.4)", borderRadius: 7, fontSize: 9, fontFamily: "JetBrains Mono" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {CATS.slice(0, 6).map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: PIECOLS[i % PIECOLS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 8, color: "rgba(220,180,180,.65)", flex: 1, fontFamily: "'JetBrains Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0" }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card glow delay={.25} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="pg" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 7px #ef4444", flexShrink: 0 }} />
              <Lbl>Anomaly Detection</Lbl>
            </div>
            <span style={{ padding: "1px 8px", borderRadius: 20, fontSize: 8, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: "rgba(239,68,68,.14)", border: "1px solid rgba(239,68,68,.32)", color: "#ef4444" }}>{ANOMALIES.length} FLAGGED</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ANOMALIES.slice(0, 3).map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .08 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 11px", borderRadius: 9, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.17)" }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(239,68,68,.11)", border: "1px solid rgba(239,68,68,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <I d={P.warn} size={11} color="#ef4444" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</div>
                  <div style={{ fontSize: 8, color: "rgba(239,68,68,.4)", marginTop: 1, fontFamily: "'JetBrains Mono',monospace" }}>{a.date} · {a.cat}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: "#ef4444", flexShrink: 0 }}>-${a.amt.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 9, padding: "6px 9px", borderRadius: 7, background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.11)" }}>
            <span style={{ fontSize: 8, color: "rgba(239,68,68,.5)", fontFamily: "'JetBrains Mono',monospace" }}>🔴 Isolation Forest · threshold &lt; -0.04</span>
          </div>
        </Card>

        <Card delay={.3} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.trend} size={12} color="#ef4444" /><Lbl>Next Month Forecast</Lbl></div>
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <div style={{ fontSize: 7, color: "rgba(239,68,68,.38)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginBottom: 5 }}>Predicted Spending</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 800, lineHeight: 1, color: trendUp ? "#ef4444" : "#22c55e", textShadow: `0 0 22px rgba(${trendUp ? "239,68,68" : "34,197,94"},.4)` }}>
              $<Count to={forecast} dec={0} dur={2000} />
            </div>
            <div className="fy" style={{ margin: "8px auto", width: "fit-content" }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={trendUp ? "#ef4444" : "#22c55e"} strokeWidth="2.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 9px rgba(${trendUp ? "239,68,68" : "34,197,94"},.7))` }}>
                <path d={trendUp ? P.arrowUpR : P.arrowDnR} />
              </svg>
            </div>
            <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: trendUp ? "rgba(239,68,68,.13)" : "rgba(34,197,94,.13)", color: trendUp ? "#ef4444" : "#22c55e", border: `1px solid ${trendUp ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)"}` }}>
              {trendUp ? "Increasing ↑" : "Decreasing ↓"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
            {[["Lower", `$${Math.round(forecast * .85).toLocaleString()}`], ["Upper", `$${Math.round(forecast * 1.15).toLocaleString()}`], ["Model R²", "0.60"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderRadius: 6, background: "rgba(139,0,0,.06)", border: "1px solid rgba(139,0,0,.11)" }}>
                <span style={{ fontSize: 8, color: "rgba(239,68,68,.4)", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "'JetBrains Mono',monospace" }}>{k}</span>
                <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "rgba(220,180,180,.75)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROW 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>
        <Card delay={.35} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><I d={P.bar} size={12} color="#ef4444" /><Lbl>Monthly Comparison</Lbl></div>
            <div style={{ display: "flex", gap: 10 }}>
              {[["Income", "#22c55e"], ["Expenses", "#8B0000"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: "rgba(220,120,120,.55)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -18 }} barSize={14} barGap={3}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Bar dataKey="income" fill="#22c55e" radius={[3, 3, 0, 0]} style={{ filter: "drop-shadow(0 0 3px rgba(34,197,94,.3))" }} />
              <Bar dataKey="expenses" fill="#8B0000" radius={[3, 3, 0, 0]} style={{ filter: "drop-shadow(0 0 3px rgba(139,0,0,.4))" }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card glow delay={.4}>
          <button onClick={() => setAdvice(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: "linear-gradient(135deg,#8B0000,#4b0000)", boxShadow: "0 0 15px rgba(139,0,0,.48)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I d={P.brain} size={16} color="#fca5a5" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", color: "#f5d0d0" }}>AI Financial Advice</div>
                <div style={{ fontSize: 8, color: "rgba(239,68,68,.4)", letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginTop: 1 }}>{ADVICE.length} recommendations</div>
              </div>
            </div>
            <motion.div animate={{ rotate: advice ? 180 : 0 }} transition={{ duration: .28 }}><I d={P.chev} size={13} color="#ef4444" /></motion.div>
          </button>
          <AnimatePresence>
            {advice && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .32, ease: [.22, 1, .36, 1] }} style={{ overflow: "hidden" }}>
                <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ height: 1, background: "linear-gradient(90deg,rgba(139,0,0,.4),transparent)", marginBottom: 3 }} />
                  {ADVICE.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .055 }}
                      style={{ padding: "9px 11px", borderRadius: 9, background: `${a.col}0d`, border: `1px solid ${a.col}22` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0" }}>{a.title}</span>
                        <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 7, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", background: `${a.col}18`, color: a.col, border: `1px solid ${a.col}30` }}>{a.lv}</span>
                      </div>
                      <p style={{ fontSize: 9, color: "rgba(220,180,180,.6)", lineHeight: 1.45, fontFamily: "'JetBrains Mono',monospace", marginBottom: 3 }}>{a.msg}</p>
                      <p style={{ fontSize: 8, color: "rgba(239,68,68,.45)", fontFamily: "'JetBrains Mono',monospace", fontStyle: "italic" }}>▶ {a.action}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════
function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Deep dive into spending patterns & trends" icon="bar" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Spent (Q1)", value: "$14,900", color: "#ef4444", up: false },
          { label: "Total Income (Q1)", value: "$20,000", color: "#22c55e", up: true },
          { label: "Avg Transaction", value: "$196", color: "#f5d0d0" },
          { label: "Total Transactions", value: "76", color: "#f59e0b" },
        ].map(s => <StatChip key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card delay={.1} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.act} size={12} color="#ef4444" /><Lbl>Weekly Spending Pattern</Lbl></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY} margin={{ top: 4, right: 4, bottom: 0, left: -18 }} barSize={18}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<TT />} />
              <Bar dataKey="spend" fill="#8B0000" radius={[4, 4, 0, 0]} style={{ filter: "drop-shadow(0 0 5px rgba(139,0,0,.5))" }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={.15} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.trend} size={12} color="#ef4444" /><Lbl>Average Spend by Day of Week</Lbl></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DAILY_PATTERN} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="dayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="avg" stroke="#ef4444" strokeWidth={2} fill="url(#dayGrad)" dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>
        <Card delay={.2} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><I d={P.bar} size={12} color="#ef4444" /><Lbl>Category Spending Distribution</Lbl></div>
          {CATS.map((c, i) => (
            <div key={c.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: "rgba(220,180,180,.7)", fontFamily: "'JetBrains Mono',monospace" }}>{c.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#f5d0d0", fontFamily: "'JetBrains Mono',monospace" }}>{c.pct}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: "rgba(139,0,0,.15)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: .2 + i * .07, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${PIECOLS[i]},${PIECOLS[i]}99)`, boxShadow: `0 0 6px ${PIECOLS[i]}60` }} />
              </div>
            </div>
          ))}
        </Card>

        <Card delay={.25} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.act} size={12} color="#ef4444" /><Lbl>Monthly Cash Flow Trend</Lbl></div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e", r: 4, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="5 3" dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: RISK ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════
function RiskPage() {
  const RISK = 46;
  const factors = [
    { name: "Savings Rate", score: 74, status: "GOOD", col: "#22c55e", desc: "Saving 26.3% of income. Above 20% target." },
    { name: "Expense Stability", score: 42, status: "WARN", col: "#f59e0b", desc: "High variance month (Mar) spiked to $7,127." },
    { name: "Housing Cost", score: 35, status: "WARN", col: "#f59e0b", desc: "36.2% of spending — exceeds 30% guideline." },
    { name: "Emergency Fund", score: 28, status: "RISK", col: "#ef4444", desc: "Estimated 1.2 months of expenses in reserve." },
    { name: "Debt Load", score: 65, status: "OK", col: "#22c55e", desc: "No high-interest debt detected in transactions." },
    { name: "Income Diversity", score: 55, status: "OK", col: "#f59e0b", desc: "Salary + freelance. 2 income sources detected." },
  ];
  return (
    <>
      <PageHeader title="Risk Analysis" subtitle="AI-powered financial risk assessment & scoring" icon="shield" />
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card glow delay={.05} style={{ padding: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Lbl>Overall Risk</Lbl>
          <div style={{ marginTop: 12 }}><Gauge score={RISK} /></div>
          <div style={{ marginTop: 12, padding: "6px 16px", borderRadius: 20, background: "rgba(245,158,11,.13)", border: "1px solid rgba(245,158,11,.3)", fontSize: 10, fontWeight: 700, color: "#f59e0b", fontFamily: "'JetBrains Mono',monospace" }}>MODERATE</div>
        </Card>

        <Card delay={.1} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.target} size={12} color="#ef4444" /><Lbl>Risk Score History</Lbl></div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={RISK_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} fill="url(#riskGrad)" dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={.15} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><I d={P.target} size={12} color="#ef4444" /><Lbl>Risk Radar Profile</Lbl></div>
          <ResponsiveContainer width="100%" height={185}>
            <RadarChart data={RISK_RADAR} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
              <PolarGrid stroke="rgba(139,0,0,.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(239,68,68,.5)", fontSize: 8, fontFamily: "JetBrains Mono" }} />
              <Radar name="Score" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} strokeWidth={2} />
              <Tooltip content={<TT />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card delay={.2} style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}><I d={P.shield} size={12} color="#ef4444" /><Lbl>Risk Factor Breakdown</Lbl></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {factors.map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 + i * .07 }}
              style={{ padding: "12px 14px", borderRadius: 11, background: `${f.col}09`, border: `1px solid ${f.col}25` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>{f.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: f.col }}>{f.score}/100</span>
                  <span style={{ padding: "1px 7px", borderRadius: 20, fontSize: 7, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: `${f.col}18`, color: f.col, border: `1px solid ${f.col}30` }}>{f.status}</span>
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: "rgba(139,0,0,.15)", overflow: "hidden", marginBottom: 7 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${f.score}%` }} transition={{ duration: 1, delay: .3 + i * .07, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${f.col}80,${f.col})`, boxShadow: `0 0 6px ${f.col}50` }} />
              </div>
              <p style={{ fontSize: 9, color: "rgba(220,180,180,.55)", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.4 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: FORECAST
// ═══════════════════════════════════════════════════════════════════════════════
function ForecastPage() {
  return (
    <>
      <PageHeader title="Forecast" subtitle="AI spending predictions · Linear Regression model" icon="trend" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Next Month (Jun)", value: "$5,281", color: "#ef4444", up: true },
          { label: "Lower Bound", value: "$4,489", color: "#22c55e" },
          { label: "Upper Bound", value: "$6,073", color: "#f59e0b" },
          { label: "Model Accuracy R²", value: "0.60", color: "#818cf8" },
        ].map(s => <StatChip key={s.label} {...s} />)}
      </div>

      <Card delay={.1} style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
          <I d={P.trend} size={12} color="#ef4444" /><Lbl>Actual vs Predicted Spending</Lbl>
          <div style={{ flex: 1 }} />
          {[["Actual", "#ef4444"], ["Predicted", "#818cf8"], ["Confidence Band", "rgba(129,140,248,.3)"]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: "rgba(220,120,120,.65)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={FORECAST_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={.25} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={.25} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(139,0,0,.09)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(239,68,68,.4)", fontSize: 8, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(239,68,68,.4)", fontSize: 7, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<TT />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(129,140,248,.08)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#060608" />
            <Area type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2.5} fill="url(#actG)" dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={2.5} strokeDasharray="6 3" fill="url(#predG)" dot={{ fill: "#818cf8", r: 4, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card delay={.15} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><I d={P.bar} size={12} color="#ef4444" /><Lbl>Category-Level Forecast (Jun)</Lbl></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {CAT_FORECAST.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 + i * .07 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 80, fontSize: 9, color: "rgba(220,180,180,.7)", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{c.name}</div>
                <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(139,0,0,.15)", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(c.forecast / 1800) * 100}%` }} transition={{ duration: 1, delay: .3 + i * .07 }}
                    style={{ height: "100%", borderRadius: 99, background: c.change > 0 ? "linear-gradient(90deg,#8B0000,#ef4444)" : "linear-gradient(90deg,#166534,#22c55e)" }} />
                </div>
                <div style={{ width: 50, textAlign: "right", fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "#f5d0d0" }}>${c.forecast}</div>
                <div style={{ width: 44, textAlign: "right", fontSize: 8, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: c.change > 0 ? "#ef4444" : c.change < 0 ? "#22c55e" : "rgba(239,68,68,.4)" }}>
                  {c.change === 0 ? "—" : `${c.change > 0 ? "+" : ""}${c.change.toFixed(1)}%`}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card glow delay={.2} style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><I d={P.brain} size={12} color="#ef4444" /><Lbl>AI Forecast Insights</Lbl></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "warn", col: "#ef4444", lv: "ALERT", title: "Health Spending Surge", msg: "Health costs projected +39.3% driven by recent $3,500 medical bill pattern. Consider health insurance review." },
              { icon: "warn", col: "#f59e0b", lv: "WARN", title: "Shopping Trend Up", msg: "Shopping category increasing 40.9%. Three consecutive months of growth detected." },
              { icon: "check", col: "#22c55e", lv: "GOOD", title: "Entertainment Dropping", msg: "Entertainment spending decreasing -14.7%. Good cost control in discretionary category." },
              { icon: "info", col: "#818cf8", lv: "TIP", title: "Seasonal Adjustment", msg: "Summer months typically show 12–18% higher transport costs. Budget accordingly." },
            ].map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 + i * .07 }}
                style={{ padding: "10px 12px", borderRadius: 10, background: `${a.col}09`, border: `1px solid ${a.col}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <I d={P[a.icon]} size={11} color={a.col} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#f5d0d0", fontFamily: "'JetBrains Mono',monospace" }}>{a.title}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 20, fontSize: 7, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: `${a.col}18`, color: a.col, border: `1px solid ${a.col}30` }}>{a.lv}</span>
                </div>
                <p style={{ fontSize: 9, color: "rgba(220,180,180,.6)", lineHeight: 1.4, fontFamily: "'JetBrains Mono',monospace" }}>{a.msg}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: REPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = TRANSACTIONS.filter(t => {
    if (filter === "debit" && t.type !== "debit") return false;
    if (filter === "credit" && t.type !== "credit") return false;
    if (search && !t.desc.toLowerCase().includes(search.toLowerCase()) && !t.cat.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalIn = TRANSACTIONS.filter(t => t.amt > 0).reduce((s, t) => s + t.amt, 0);
  const totalOut = TRANSACTIONS.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0);

  return (
    <>
      <PageHeader title="Reports" subtitle="Transaction history · Export & filter" icon="file" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <StatChip label="Total Income" value={`$${totalIn.toLocaleString()}`} color="#22c55e" up={true} />
        <StatChip label="Total Expenses" value={`$${totalOut.toLocaleString()}`} color="#ef4444" up={false} />
        <StatChip label="Net Flow" value={`$${(totalIn - totalOut).toLocaleString()}`} color="#f59e0b" />
        <StatChip label="Transactions" value={TRANSACTIONS.length} color="#818cf8" />
      </div>

      <Card delay={.1} style={{ padding: 16 }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <I d={P.file} size={12} color="#ef4444" /><Lbl>Transaction History</Lbl>
          <div style={{ flex: 1 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
            style={{ padding: "6px 12px", borderRadius: 7, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.22)", color: "#f5d0d0", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", outline: "none", width: 180 }} />
          {["all", "debit", "credit"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".1em", background: filter === f ? "linear-gradient(135deg,#8B0000,#6b0000)" : "rgba(139,0,0,.08)", color: filter === f ? "#fca5a5" : "rgba(239,68,68,.4)", boxShadow: filter === f ? "0 0 12px rgba(139,0,0,.3)" : "none" }}>
              {f}
            </button>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(139,0,0,.22)", background: "rgba(139,0,0,.08)", cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: "rgba(239,68,68,.6)" }}>
            <I d={P.download} size={11} color="rgba(239,68,68,.6)" /> Export
          </button>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 120px 80px 90px", gap: 8, padding: "7px 12px", borderRadius: 7, background: "rgba(139,0,0,.1)", marginBottom: 6 }}>
          {["Date", "Description", "Category", "Type", "Amount"].map(h => (
            <span key={h} style={{ fontSize: 8, color: "rgba(239,68,68,.5)", textTransform: "uppercase", letterSpacing: ".15em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {filtered.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .04 }}
              style={{ display: "grid", gridTemplateColumns: "100px 1fr 120px 80px 90px", gap: 8, padding: "9px 12px", borderRadius: 7, marginBottom: 3, background: i % 2 === 0 ? "rgba(139,0,0,.04)" : "transparent", border: "1px solid rgba(139,0,0,.08)" }}>
              <span style={{ fontSize: 9, color: "rgba(239,68,68,.45)", fontFamily: "'JetBrains Mono',monospace" }}>{t.date}</span>
              <span style={{ fontSize: 10, color: "#f5d0d0", fontFamily: "'JetBrains Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</span>
              <span style={{ fontSize: 9, color: "rgba(220,180,180,.6)", fontFamily: "'JetBrains Mono',monospace" }}>{t.cat}</span>
              <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, background: t.type === "credit" ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", color: t.type === "credit" ? "#22c55e" : "#ef4444", border: `1px solid ${t.type === "credit" ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.25)"}`, width: "fit-content" }}>
                {t.type}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: t.amt > 0 ? "#22c55e" : "#ef4444", textAlign: "right" }}>
                {t.amt > 0 ? "+" : ""}${Math.abs(t.amt).toLocaleString()}
              </span>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "30px", textAlign: "center", color: "rgba(239,68,68,.3)", fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}>No transactions match your filter</div>
          )}
        </div>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifAnomaly, setNotifAnomaly] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [threshold, setThreshold] = useState(500);
  const [currency, setCurrency] = useState("USD");
  const [riskTol, setRiskTol] = useState(50);

  const Toggle = ({ value, onChange, label, desc }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(139,0,0,.1)" }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>{label}</div>
        <div style={{ fontSize: 9, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{desc}</div>
      </div>
      <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", position: "relative", background: value ? "linear-gradient(135deg,#8B0000,#ef4444)" : "rgba(139,0,0,.15)", border: `1px solid ${value ? "rgba(239,68,68,.4)" : "rgba(139,0,0,.25)"}`, boxShadow: value ? "0 0 12px rgba(239,68,68,.35)" : "none", transition: "all .25s", flexShrink: 0 }}>
        <motion.div animate={{ x: value ? 20 : 2 }} transition={{ duration: .2 }} style={{ position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", background: value ? "#fff" : "rgba(139,0,0,.4)", boxShadow: value ? "0 0 6px rgba(255,255,255,.4)" : "none" }} />
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Settings" subtitle="Account preferences · Alerts · Configuration" icon="gear" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Profile */}
        <Card delay={.05} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}><I d={P.user} size={13} color="#ef4444" /><Lbl>Profile</Lbl></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#8B0000,#4b0000)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fca5a5", fontFamily: "'JetBrains Mono',monospace", boxShadow: "0 0 20px rgba(139,0,0,.5)", flexShrink: 0 }}>AJ</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>Rahul Kafle</div>
              <div style={{ fontSize: 9, color: "rgba(239,68,68,.5)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>rrkafle2@gmail.com</div>
              <div style={{ marginTop: 6, padding: "2px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: "rgba(239,68,68,.13)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", display: "inline-block" }}>PREMIUM PLAN</div>
            </div>
          </div>
          {[["Full Name", "Rahul Kafle"], ["Email", "rrkafle2@gmail.com"], ["Phone", "9953963115"], ["Member Since", "January 2024"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(139,0,0,.08)" }}>
              <span style={{ fontSize: 9, color: "rgba(239,68,68,.42)", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "'JetBrains Mono',monospace" }}>{k}</span>
              <span style={{ fontSize: 10, color: "#f5d0d0", fontFamily: "'JetBrains Mono',monospace" }}>{v}</span>
            </div>
          ))}
          <button style={{ marginTop: 14, width: "100%", padding: "9px", borderRadius: 9, border: "1px solid rgba(139,0,0,.3)", background: "rgba(139,0,0,.1)", cursor: "pointer", fontSize: 11, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, color: "rgba(239,68,68,.6)", letterSpacing: ".05em" }}>
            Edit Profile
          </button>
        </Card>

        {/* Notifications */}
        <Card delay={.1} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><I d={P.bell} size={13} color="#ef4444" /><Lbl>Notifications</Lbl></div>
          <Toggle value={notifEmail} onChange={setNotifEmail} label="Email Alerts" desc="Receive financial summaries via email" />
          <Toggle value={notifAnomaly} onChange={setNotifAnomaly} label="Anomaly Detection Alerts" desc="Get notified when unusual transactions are detected" />
          <Toggle value={notifWeekly} onChange={setNotifWeekly} label="Weekly Report" desc="Receive weekly spending digest every Sunday" />

          <div style={{ marginTop: 18, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>Anomaly Threshold</div>
                <div style={{ fontSize: 9, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>Flag transactions above this amount</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", fontFamily: "'JetBrains Mono',monospace" }}>${threshold}</span>
            </div>
            <input type="range" min={100} max={2000} step={50} value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        </Card>

        {/* Preferences */}
        <Card delay={.15} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><I d={P.gear} size={13} color="#ef4444" /><Lbl>Preferences</Lbl></div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif", marginBottom: 8 }}>Currency</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["USD", "EUR", "GBP", "INR"].map(c => (
                <button key={c} onClick={() => setCurrency(c)} style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, background: currency === c ? "linear-gradient(135deg,#8B0000,#6b0000)" : "rgba(139,0,0,.08)", color: currency === c ? "#fca5a5" : "rgba(239,68,68,.4)", boxShadow: currency === c ? "0 0 10px rgba(139,0,0,.3)" : "none" }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>Risk Tolerance</div>
                <div style={{ fontSize: 9, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>Adjust your risk appetite for recommendations</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: riskTol < 40 ? "#22c55e" : riskTol < 70 ? "#f59e0b" : "#ef4444" }}>
                {riskTol < 40 ? "Conservative" : riskTol < 70 ? "Moderate" : "Aggressive"}
              </span>
            </div>
            <input type="range" min={0} max={100} value={riskTol} onChange={e => setRiskTol(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, padding: "9px", borderRadius: 9, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.2)", textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em" }}>Savings Goal</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#22c55e", fontFamily: "'JetBrains Mono',monospace", marginTop: 3 }}>$2,000<span style={{ fontSize: 10 }}>/mo</span></div>
            </div>
            <div style={{ flex: 1, padding: "9px", borderRadius: 9, background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.2)", textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "rgba(239,68,68,.4)", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em" }}>Budget Cap</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b", fontFamily: "'JetBrains Mono',monospace", marginTop: 3 }}>$5,000<span style={{ fontSize: 10 }}>/mo</span></div>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card delay={.2} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><I d={P.lock} size={13} color="#ef4444" /><Lbl>Security & Data</Lbl></div>
          {[
            { icon: "lock", label: "Change Password", desc: "Last changed 45 days ago", btn: "Update" },
            { icon: "refresh", label: "Re-sync CSV Data", desc: "Import latest transactions from your file", btn: "Sync" },
            { icon: "download", label: "Export All Data", desc: "Download your complete financial history", btn: "Export" },
            { icon: "mail", label: "Two-Factor Auth", desc: "Add an extra layer of account security", btn: "Enable" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(139,0,0,.09)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(139,0,0,.12)", border: "1px solid rgba(139,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <I d={P[s.icon]} size={13} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#f5d0d0", fontFamily: "'Rajdhani',sans-serif" }}>{s.label}</div>
                  <div style={{ fontSize: 8, color: "rgba(239,68,68,.38)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
              <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(139,0,0,.28)", background: "rgba(139,0,0,.1)", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "rgba(239,68,68,.6)" }}>{s.btn}</button>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 9, background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)" }}>
            <div style={{ fontSize: 9, color: "rgba(239,68,68,.5)", fontFamily: "'JetBrains Mono',monospace" }}>🔐 Your data is encrypted end-to-end. FinAdvisor AI never shares your financial data.</div>
          </div>
        </Card>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [notif, setNotif] = useState(false);
  const [advice, setAdvice] = useState(false);
  const [monthly, setMonthly] = useState(MONTHLY);
  const [toast, setToast] = useState(null);
  const RISK = 46;

  const onUpload = useCallback(e => {
    const f = e.target.files[0]; if (!f) return;
    setToast({ t: "load", m: "Processing CSV..." });
    const r = new FileReader();
    r.onload = ev => {
      try {
        const lines = ev.target.result.split("\n").filter(Boolean);
        const hdrs = lines[0].toLowerCase().split(",").map(h => h.trim());
        const rows = lines.slice(1).map(l => { const v = l.split(","); return hdrs.reduce((a, h, i) => ({ ...a, [h]: v[i]?.trim() }), {}); });
        const agg = {};
        rows.forEach(row => {
          if (!row.date || !row.amount) return;
          const d = new Date(row.date);
          const k = d.toLocaleString("default", { month: "short" });
          if (!agg[k]) agg[k] = { month: k, income: 0, expenses: 0 };
          const amt = parseFloat(row.amount);
          if (amt > 0) agg[k].income += amt; else agg[k].expenses += Math.abs(amt);
        });
        const arr = Object.values(agg).map(m => ({ ...m, savings: m.income - m.expenses }));
        if (arr.length > 0) { setMonthly(arr); setToast({ t: "ok", m: "Dashboard updated!" }); }
        else setToast({ t: "err", m: "No valid rows found" });
      } catch { setToast({ t: "err", m: "Invalid CSV format" }); }
      setTimeout(() => setToast(null), 3000);
    };
    r.readAsText(f);
  }, []);

  const pageMap = {
    dashboard: <DashboardPage monthly={monthly} advice={advice} setAdvice={setAdvice} />,
    analytics: <AnalyticsPage />,
    risk: <RiskPage />,
    forecast: <ForecastPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
        <Sidebar active={active} setActive={setActive} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative", minWidth: 0 }}>
          {/* Grid bg */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(139,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,0,0,.04) 1px,transparent 1px)", backgroundSize: "38px 38px", zIndex: 0 }} />
          <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(139,0,0,.12),transparent)", animation: "scanY 9s linear infinite", zIndex: 1, pointerEvents: "none" }} />
          <Particles />

          <Header risk={RISK} onUpload={onUpload} notifOpen={notif} setNotifOpen={setNotif} />

          {/* PAGE CONTENT with animated transitions */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "18px 24px 24px", position: "relative", zIndex: 2 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: .3, ease: [.22, 1, .36, 1] }}>
                {pageMap[active]}
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, marginTop: 4 }}>
              <span style={{ fontSize: 8, color: "rgba(139,0,0,.28)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".12em" }}>FINADVISOR AI © 2024 · ALL RIGHTS RESERVED</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="pg" style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B0000" }} />
                <span style={{ fontSize: 8, color: "rgba(139,0,0,.28)", fontFamily: "'JetBrains Mono',monospace" }}>LIVE · ISOLATION FOREST v2 · LINEAR REGRESSION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 70 }}
            style={{ position: "fixed", bottom: 18, right: 18, zIndex: 999, display: "flex", alignItems: "center", gap: 9, padding: "9px 16px", borderRadius: 9, background: toast.t === "ok" ? "rgba(21,128,61,.93)" : toast.t === "err" ? "rgba(127,29,29,.93)" : "rgba(139,0,0,.93)", border: "1px solid rgba(255,255,255,.09)", boxShadow: "0 8px 28px rgba(0,0,0,.5)", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#fff" }}>
            {toast.t === "load" && <div className="rot"><I d={P.spin} size={12} color="#fff" /></div>}
            {toast.t === "ok" && <I d={P.check} size={12} color="#fff" />}
            {toast.m}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
