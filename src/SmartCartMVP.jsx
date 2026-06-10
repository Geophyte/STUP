import { useState, useEffect, useRef } from "react";

const COLORS = {
  green: "#1E7A48",
  greenLight: "#E8F5EE",
  greenMid: "#2D9A5E",
  amber: "#E8880A",
  amberLight: "#FEF3E2",
  bg: "#F7F9F7",
  card: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5EAE7",
  red: "#DC2626",
  redLight: "#FEF2F2",
};

const STORES = ["Biedronka", "Lidl", "Żabka", "Carrefour"];
const BRANDS = ["Łaciate", "Danone", "Hochland", "Zott", "Mlekovita"];
const DIETS = ["Brak ograniczeń", "Wegetariańska", "Wegańska", "Bezglutenowa", "Bezlaktozowa"];

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Mleko 3,2% Łaciate 1L", store: "Biedronka", price: 3.49, original: 4.29, category: "Nabiał", eco: true, brand: "Łaciate", qty: 2 },
  { id: 2, name: "Jogurt naturalny Danone 400g", store: "Lidl", price: 2.99, original: 3.59, category: "Nabiał", eco: false, brand: "Danone", qty: 1 },
  { id: 3, name: "Chleb żytni razowy 500g", store: "Biedronka", price: 3.89, original: 4.99, category: "Pieczywo", eco: true, brand: "SPC", qty: 1 },
  { id: 4, name: "Filet z kurczaka 1kg", store: "Carrefour", price: 14.99, original: 18.99, category: "Mięso", eco: false, brand: "Indykpol", qty: 1 },
  { id: 5, name: "Pomidory koktajlowe 500g", store: "Lidl", price: 5.49, original: 6.99, category: "Warzywa", eco: true, brand: "Bio Planet", qty: 1 },
  { id: 6, name: "Pasta do zębów Colgate 75ml", store: "Biedronka", price: 4.99, original: 7.29, category: "Chemia", eco: false, brand: "Colgate", qty: 2 },
  { id: 7, name: "Proszek do prania Ariel 1.5kg", store: "Carrefour", price: 24.99, original: 31.99, category: "Chemia", eco: false, brand: "Ariel", qty: 1 },
  { id: 8, name: "Makaron penne 500g", store: "Biedronka", price: 2.49, original: 3.29, category: "Suche", eco: false, brand: "Barilla", qty: 2 },
];

function useCounter(target, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start * 100) / 100);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return value;
}

// ── SCREEN 1: Onboarding ──────────────────────────────────────────────────
function OnboardingScreen({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: COLORS.green }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, textAlign: "center", margin: "0 0 8px", letterSpacing: -1 }}>
          SmartCart
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, textAlign: "center", margin: "0 0 40px", lineHeight: 1.5 }}>
          Kupuj mądrzej, żyj łatwiej – my wybieramy za Ciebie to, co naprawdę się opłaca.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          {[
            { icon: "⚡", text: "Oszcędność czasu — gotowy koszyk w kilka sekund" },
            { icon: "💰", text: "Najlepsza cena vs. jakość dzięki analizie AI" },
            { icon: "🌿", text: "Eco-Delivery — minimalizuj ślad węglowy zakupów" },
          ].map((item) => (
            <div key={item.icon} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px" }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ color: "#fff", fontSize: 13, lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 28px 40px" }}>
        <button onClick={onNext} style={btnStyle({ full: true, color: "#fff", bg: COLORS.amber })}>
          Zacznij oszczędzać →
        </button>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center", marginTop: 12 }}>
          Bezpłatnie · Bez rejestracji na start
        </p>
      </div>
    </div>
  );
}

// ── SCREEN 2: Preferences ─────────────────────────────────────────────────
function PreferencesScreen({ onNext }) {
  const [budget, setBudget] = useState(200);
  const [selectedStores, setSelectedStores] = useState(["Biedronka", "Lidl"]);
  const [selectedBrands, setSelectedBrands] = useState(["Łaciate"]);
  const [diet, setDiet] = useState("Brak ograniczeń");
  const [eco, setEco] = useState(true);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: COLORS.bg }}>
      <div style={headerStyle}>
        <h2 style={headerTitle}>Moje preferencje</h2>
        <p style={headerSub}>Dostosuj koszyk do swoich potrzeb</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {/* Budget */}
        <Section title="Budżet tygodniowy">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <input type="range" min={50} max={800} step={10} value={budget} onChange={(e) => setBudget(+e.target.value)}
              style={{ flex: 1, accentColor: COLORS.green }} />
            <span style={{ fontWeight: 700, color: COLORS.green, fontSize: 18, minWidth: 64, textAlign: "right" }}>{budget} zł</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={labelMuted}>50 zł</span><span style={labelMuted}>800 zł</span>
          </div>
        </Section>

        {/* Stores */}
        <Section title="Preferowane sklepy">
          <div style={chipRow}>
            {STORES.map((s) => (
              <Chip key={s} label={s} active={selectedStores.includes(s)} onToggle={() => toggle(selectedStores, setSelectedStores, s)} />
            ))}
          </div>
        </Section>

        {/* Brands */}
        <Section title="Ulubione marki (nabiał)">
          <div style={chipRow}>
            {BRANDS.map((b) => (
              <Chip key={b} label={b} active={selectedBrands.includes(b)} onToggle={() => toggle(selectedBrands, setSelectedBrands, b)} />
            ))}
          </div>
        </Section>

        {/* Diet */}
        <Section title="Preferencje dietetyczne">
          <div style={chipRow}>
            {DIETS.map((d) => (
              <Chip key={d} label={d} active={diet === d} onToggle={() => setDiet(d)} />
            ))}
          </div>
        </Section>

        {/* Eco toggle */}
        <Section title="Opcje ekologiczne">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: eco ? COLORS.greenLight : "#F3F4F6", borderRadius: 12, padding: "12px 16px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>🌿 Eco-Delivery First</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Łącz dostawy, ograniczaj plastik</div>
            </div>
            <div onClick={() => setEco(!eco)} style={{ width: 44, height: 26, borderRadius: 13, background: eco ? COLORS.green : "#D1D5DB", cursor: "pointer", position: "relative", transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 3, left: eco ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
            </div>
          </div>
        </Section>
      </div>
      <div style={{ padding: "12px 20px 32px" }}>
        <button onClick={() => onNext({ budget, selectedStores, selectedBrands, diet, eco })}
          style={btnStyle({ full: true, color: "#fff", bg: COLORS.green })}>
          Generuj mój koszyk ✨
        </button>
      </div>
    </div>
  );
}

// ── SCREEN 3: Generating ──────────────────────────────────────────────────
function GeneratingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analizuję oferty z wybranych sklepów…",
    "Porównuję ceny i jakość produktów…",
    "Optymalizuję ślad węglowy dostawy…",
    "Układam Twój koszyk premium…",
    "Gotowe! 🎉",
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length - 1) { clearInterval(t); setTimeout(onDone, 600); }
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: COLORS.bg, padding: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>🧠</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 8, textAlign: "center" }}>SmartCart AI pracuje…</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 40, textAlign: "center" }}>Przetwarzam tysiące ofert, żebyś Ty nie musiał/a</p>
      <div style={{ width: "100%", background: COLORS.border, borderRadius: 99, height: 8, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.amber})`, width: `${(step / (steps.length - 1)) * 100}%`, transition: "width .5s ease" }} />
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, opacity: i <= step ? 1 : 0.25, transition: "opacity .3s" }}>
          <span style={{ fontSize: 16 }}>{i < step ? "✅" : i === step ? "⏳" : "⬜"}</span>
          <span style={{ fontSize: 13, color: i === step ? COLORS.green : COLORS.muted, fontWeight: i === step ? 600 : 400 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

// ── SCREEN 4: Cart ────────────────────────────────────────────────────────
function CartScreen({ prefs, onReset }) {
  const [items, setItems] = useState(SAMPLE_PRODUCTS);
  const [locked, setLocked] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [tab, setTab] = useState("koszyk");

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const saved = items.reduce((s, i) => s + (i.original - i.price) * i.qty, 0);
  const co2 = (items.filter((i) => i.eco).length * 0.3 + 1.2).toFixed(1);
  const savedCounter = useCounter(Math.round(saved * 100) / 100, 1000, true);
  const co2Counter = useCounter(+co2, 1000, true);

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const toggleLock = (id) => setLocked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const storeGroups = STORES.filter((s) => items.some((i) => i.store === s));

  if (accepted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: COLORS.greenLight, padding: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.green, textAlign: "center", marginBottom: 8 }}>Koszyk zaakceptowany!</h2>
        <p style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", marginBottom: 32 }}>Twoje zamówienie zostało przekazane do sklepów. W ciągu 2h produkty będą gotowe do odbioru po drodze z pracy.</p>
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <StatBox icon="💰" label="Zaoszczędzono" value={`${saved.toFixed(2)} zł`} />
          <StatBox icon="🌿" label="CO₂ mniej" value={`${co2} kg`} />
        </div>
        <button onClick={onReset} style={btnStyle({ full: true, color: "#fff", bg: COLORS.green })}>
          Wróć na start
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: COLORS.bg }}>
      {/* Header */}
      <div style={{ ...headerStyle, paddingBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={headerTitle}>Twój koszyk</h2>
            <p style={headerSub}>Budżet: {prefs.budget} zł · {items.length} produktów</p>
          </div>
          <button onClick={onReset} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 13, padding: "4px 8px" }}>← nowy</button>
        </div>
        {/* Savings banner */}
        <div style={{ display: "flex", gap: 10, margin: "12px 0 0", background: COLORS.amberLight, borderRadius: 12, padding: "10px 14px", border: `1px solid #F5D08A` }}>
          <span style={{ fontSize: 20 }}>💰</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.amber }}>Oszczędzasz dziś {savedCounter.toFixed(2)} zł</div>
            <div style={{ fontSize: 11, color: "#92640A" }}>i redukujesz {co2Counter.toFixed(1)} kg CO₂ dzięki Eco-Delivery</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 12, borderBottom: `2px solid ${COLORS.border}` }}>
          {["koszyk", "trasa"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? COLORS.green : COLORS.muted, borderBottom: tab === t ? `2px solid ${COLORS.green}` : "2px solid transparent", cursor: "pointer", marginBottom: -2, textTransform: "capitalize" }}>
              {t === "koszyk" ? "🛒 Koszyk" : "🗺️ Smart Route"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
        {tab === "koszyk" ? (
          <>
            {storeGroups.map((store) => (
              <div key={store} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{store}</div>
                {items.filter((i) => i.store === store).map((item) => (
                  <div key={item.id} style={{ background: COLORS.card, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 12, alignItems: "center", border: `1px solid ${locked.includes(item.id) ? COLORS.green : COLORS.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{item.name}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.green }}>{item.price.toFixed(2)} zł</span>
                        <span style={{ fontSize: 11, color: COLORS.muted, textDecoration: "line-through" }}>{item.original.toFixed(2)} zł</span>
                        {item.eco && <span style={{ fontSize: 10, background: COLORS.greenLight, color: COLORS.green, borderRadius: 4, padding: "1px 5px", fontWeight: 600 }}>🌿 eko</span>}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>szt. {item.qty} · kat. {item.category}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                      <button onClick={() => toggleLock(item.id)} title={locked.includes(item.id) ? "Zablokowana marka" : "Zablokuj markę"} style={{ background: locked.includes(item.id) ? COLORS.greenLight : "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>
                        {locked.includes(item.id) ? "🔒" : "🔓"}
                      </button>
                      <button onClick={() => removeItem(item.id)} style={{ background: COLORS.redLight, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <RouteTab items={items} />
        )}
      </div>

      <div style={{ padding: "12px 20px 32px", background: COLORS.card, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: COLORS.muted }}>Łącznie ({items.reduce((s, i) => s + i.qty, 0)} szt.)</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>{total.toFixed(2)} zł</span>
        </div>
        <button onClick={() => setAccepted(true)} style={btnStyle({ full: true, color: "#fff", bg: COLORS.green })}>
          ✅ Zaakceptuj koszyk
        </button>
      </div>
    </div>
  );
}

function RouteTab({ items }) {
  const stops = [...new Set(items.map((i) => i.store))];
  const points = { "Biedronka": { addr: "ul. Marszałkowska 84", time: "po drodze", dist: "0 km nadkładania" }, "Lidl": { addr: "ul. Nowogrodzka 11", time: "po drodze", dist: "0.3 km nadkładania" }, "Carrefour": { addr: "ul. Złota 59", time: "+5 min", dist: "0.8 km nadkładania" } };
  return (
    <div>
      <div style={{ background: COLORS.greenLight, borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>🗺️ Smart Route — optymalna trasa</div>
        <div style={{ fontSize: 12, color: COLORS.muted }}>Produkty zgrupowane po sklepach na trasie praca → dom. Nadkładasz tylko 1.1 km.</div>
      </div>
      {stops.map((s, i) => (
        <div key={s} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.green, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            {i < stops.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, background: COLORS.card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${COLORS.border}`, marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 2 }}>{s}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{points[s]?.addr}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 11, background: COLORS.greenLight, color: COLORS.green, borderRadius: 4, padding: "2px 7px", fontWeight: 600 }}>{points[s]?.time}</span>
              <span style={{ fontSize: 11, background: "#F3F4F6", color: COLORS.muted, borderRadius: 4, padding: "2px 7px" }}>{points[s]?.dist}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>
              {items.filter((it) => it.store === s).map((it) => it.name.split(" ").slice(0, 3).join(" ")).join(", ")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Chip({ label, active, onToggle }) {
  return (
    <button onClick={onToggle} style={{ background: active ? COLORS.green : COLORS.card, color: active ? "#fff" : COLORS.text, border: `1.5px solid ${active ? COLORS.green : COLORS.border}`, borderRadius: 99, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all .15s" }}>
      {label}
    </button>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", textAlign: "center", flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.green, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

const btnStyle = ({ full, color, bg }) => ({
  width: full ? "100%" : "auto",
  background: bg,
  color,
  border: "none",
  borderRadius: 14,
  padding: "15px 24px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: -0.3,
});

const headerStyle = { background: COLORS.card, padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}` };
const headerTitle = { fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0, letterSpacing: -0.5 };
const headerSub = { fontSize: 13, color: COLORS.muted, margin: "4px 0 0" };
const chipRow = { display: "flex", flexWrap: "wrap", gap: 8 };
const labelMuted = { fontSize: 11, color: COLORS.muted };

// ── Root ──────────────────────────────────────────────────────────────────
export default function SmartCartApp() {
  const [screen, setScreen] = useState("onboarding");
  const [prefs, setPrefs] = useState({});

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#D1E8D9", padding: "20px 0" }}>
      <div style={{ width: 390, height: 780, background: COLORS.card, borderRadius: 36, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.1)", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Status bar mockup */}
        <div style={{ background: screen === "onboarding" ? COLORS.green : COLORS.card, padding: "10px 24px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: screen === "onboarding" ? "rgba(255,255,255,.7)" : COLORS.muted }}>9:41</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["▲▲▲", "📶", "🔋"].map((x) => <span key={x} style={{ fontSize: 10, color: screen === "onboarding" ? "rgba(255,255,255,.7)" : COLORS.muted }}>{x}</span>)}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {screen === "onboarding" && <OnboardingScreen onNext={() => setScreen("prefs")} />}
          {screen === "prefs" && <PreferencesScreen onNext={(p) => { setPrefs(p); setScreen("generating"); }} />}
          {screen === "generating" && <GeneratingScreen onDone={() => setScreen("cart")} />}
          {screen === "cart" && <CartScreen prefs={prefs} onReset={() => setScreen("onboarding")} />}
        </div>
      </div>
    </div>
  );
}
