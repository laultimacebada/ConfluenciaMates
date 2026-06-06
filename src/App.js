import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAjooz-RJ7TcDT7BGFnv9D89BXEqp2KnJ0",
  authDomain:        "laultimacebada-6b5a6.firebaseapp.com",
  databaseURL:       "https://laultimacebada-6b5a6-default-rtdb.firebaseio.com",
  projectId:         "laultimacebada-6b5a6",
  storageBucket:     "laultimacebada-6b5a6.firebasestorage.app",
  messagingSenderId: "1090191844554",
  appId:             "1:1090191844554:web:0e7107e341508e056ac033",
};

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(firebaseApp);

// Clave por defecto si nunca se guardó una en Firebase
const CLAVE_DEFAULT = "confluencia2024";

// Paleta: tonos tierra/marrón cálido con verde
const C = {
  // Verdes
  verdeOsc:  "#1E3A1E",
  verde:     "#2D5A2D",
  verdeMed:  "#3D7A3D",
  verdeSuave:"#5A9B5A",
  // Tierra y marrones cálidos
  tierra:    "#8B5E3C",
  tierraMed: "#A67C52",
  tierraSub: "#C49A6C",
  // Cremas y beiges
  crema:     "#FAF3E8",
  cremaDark: "#F0E6D3",
  beige:     "#DDD0B8",
  beigeOsc:  "#C4B49A",
  // Textos
  texto:     "#2C1A0E",
  textoMed:  "#5C3D1E",
  textoSub:  "#8B6540",
  // Acentos
  dorado:    "#D4A843",
  ambar:     "#E07B39",
  // Especiales
  blanco:    "#FDFAF4",
  wsp:       "#25D366",
  rojo:      "#C0392B",
};

const DATA_INICIAL = {
  config: {
    nombreTienda:  "Confluencia Mate",
    eslogan:       "Mates, bombillas, canastas y accesorios",
    whatsapp:      "5492994000000",
    moneda:        "$",
    logoTexto:     "CM",
    heroImagenURL: "",
    bannerTexto:   "Envíos por todo Neuquén · Neuquén, Plottier · Consultá por WhatsApp o Instagram",
    instagram:     "confluencia.mates",
    facebook:      "",
    ubicacion:     "Neuquén, Plottier",
  },
  categorias: {},
  clave:     CLAVE_DEFAULT,
};

function useFirebaseData() {
  const [data, setData] = useState(DATA_INICIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeRef = ref(db, "tienda");
    const unsub = onValue(storeRef, (snap) => {
      const val = snap.val();
      if (val) {
        // Asegurar que exista el campo clave
        if (!val.clave) val.clave = CLAVE_DEFAULT;
        setData(val);
      } else {
        set(ref(db, "tienda"), DATA_INICIAL);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const guardar = useCallback(async (nuevaData) => {
    setData(nuevaData);
    try {
      await set(ref(db, "tienda"), nuevaData);
    } catch (e) {
      console.error("Error guardando:", e);
    }
  }, []);

  return { data, guardar, loading };
}

// ─── Componente Input reutilizable ─────────────────────────────────────────
function Input({ label, value, onChange, placeholder, hint, type = "text" }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "block" }}>
      {label && (
        <span style={{
          fontSize: 11, fontWeight: 700, color: C.textoMed,
          letterSpacing: "0.08em", textTransform: "uppercase",
          display: "block", marginBottom: 5,
        }}>{label}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "10px 13px", borderRadius: 10,
          border: `1.5px solid ${focus ? C.verde : C.beige}`,
          background: C.blanco, fontSize: 14, color: C.texto,
          outline: "none", fontFamily: "inherit", transition: "border-color .2s",
          boxSizing: "border-box",
        }}
      />
      {hint && <span style={{ fontSize: 11, color: C.textoSub, marginTop: 4, display: "block" }}>{hint}</span>}
    </label>
  );
}

// ─── Modal de clave ─────────────────────────────────────────────────────────
function ModalClave({ claveGuardada, onSuccess, onClose }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  function verificar() {
    const claveReal = claveGuardada || CLAVE_DEFAULT;
    if (clave === claveReal) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setClave("");
      setTimeout(() => setShake(false), 500);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      background: "rgba(30,20,10,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
      `}</style>
      <div style={{
        background: C.blanco, borderRadius: 24, width: "100%", maxWidth: 340,
        overflow: "hidden", boxShadow: "0 32px 80px rgba(30,20,10,0.45)",
        animation: "popIn .25s ease",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(150deg, ${C.verdeOsc} 0%, ${C.verde} 60%, ${C.tierra} 100%)`,
          padding: "32px 24px 24px", textAlign: "center",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: `2px solid ${C.dorado}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 14px",
          }}>🔒</div>
          <p style={{ color: C.dorado, fontWeight: 900, fontSize: 18, margin: 0 }}>
            Área del vendedor
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>
            Ingresá tu contraseña
          </p>
        </div>
        {/* Body */}
        <div style={{ padding: "22px 22px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ animation: shake ? "shake .45s ease" : "none" }}>
            <input
              ref={inputRef}
              type="password"
              value={clave}
              autoFocus
              onChange={(e) => { setClave(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && verificar()}
              placeholder="Contraseña"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 11,
                border: `2px solid ${error ? "#f87171" : C.beige}`,
                background: error ? "#fff5f5" : C.blanco,
                fontSize: 15, color: C.texto, outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
            {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5, fontWeight: 600 }}>Contraseña incorrecta</p>}
          </div>
          <button
            onClick={verificar}
            style={{
              width: "100%", padding: 12, borderRadius: 11,
              background: `linear-gradient(135deg, ${C.verde}, ${C.verdeOsc})`,
              color: "#fff", fontWeight: 800, fontSize: 15,
              border: "none", cursor: "pointer", fontFamily: "inherit",
            }}
          >Ingresar</button>
          <button
            onClick={onClose}
            style={{ width: "100%", padding: 8, background: "none", border: "none", color: C.textoSub, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Panel Admin ─────────────────────────────────────────────────────────────
function PanelAdmin({ data, onSave, onClose }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(data)));
  const [sec, setSec] = useState("tienda");
  const [catKey, setCatKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [claveMsg, setClaveMsg] = useState(null);

  const cfg = draft.config;
  const cats = draft.categorias || {};
  const catKeys = Object.keys(cats);
  const cat = catKey ? cats[catKey] : null;

  function setC(k, v) {
    setDraft((d) => ({ ...d, config: { ...d.config, [k]: v } }));
  }

  function cambiarClave() {
    if (!nuevaClave || nuevaClave.length < 6) {
      setClaveMsg({ tipo: "error", txt: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (nuevaClave !== confirmarClave) {
      setClaveMsg({ tipo: "error", txt: "Las contraseñas no coinciden." });
      return;
    }
    setDraft((d) => ({ ...d, clave: nuevaClave }));
    setNuevaClave("");
    setConfirmarClave("");
    setClaveMsg({ tipo: "ok", txt: "✓ Contraseña actualizada. Guardá para aplicar el cambio." });
    setTimeout(() => setClaveMsg(null), 4000);
  }

  function addCat() {
    const key = "cat_" + Date.now();
    setDraft((d) => ({ ...d, categorias: { ...d.categorias, [key]: { nombre: "", productos: {} } } }));
    setCatKey(key);
    setSec("productos");
  }

  function delCat(k) {
    const c = { ...cats };
    delete c[k];
    setDraft((d) => ({ ...d, categorias: c }));
    if (catKey === k) setCatKey(null);
  }

  function setCatNombre(k, v) {
    setDraft((d) => ({ ...d, categorias: { ...d.categorias, [k]: { ...d.categorias[k], nombre: v } } }));
  }

  function addProd() {
    if (!catKey) return;
    const key = "p_" + Date.now();
    setDraft((d) => ({
      ...d,
      categorias: {
        ...d.categorias,
        [catKey]: {
          ...d.categorias[catKey],
          productos: {
            ...(d.categorias[catKey].productos || {}),
            [key]: { nombre: "", precio: "", descripcion: "", imagenURL: "" },
          },
        },
      },
    }));
  }

  function delProd(pk) {
    const prods = { ...(cat.productos || {}) };
    delete prods[pk];
    setDraft((d) => ({ ...d, categorias: { ...d.categorias, [catKey]: { ...cat, productos: prods } } }));
  }

  function setProd(pk, field, val) {
    setDraft((d) => ({
      ...d,
      categorias: {
        ...d.categorias,
        [catKey]: {
          ...d.categorias[catKey],
          productos: {
            ...d.categorias[catKey].productos,
            [pk]: { ...d.categorias[catKey].productos[pk], [field]: val },
          },
        },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    onClose();
  }

  const secs = [
    { id: "tienda",    icon: "🏪", label: "Tienda"     },
    { id: "hero",      icon: "🖼",  label: "Hero"       },
    { id: "categorias",icon: "📂", label: "Categorías" },
    { id: "productos", icon: "🧉", label: "Productos"  },
    { id: "clave",     icon: "🔑", label: "Clave"      },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 70,
      background: "rgba(30,20,10,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 12,
    }}>
      <div style={{
        background: C.blanco, borderRadius: 24, width: "100%", maxWidth: 640,
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(30,20,10,0.35)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.verdeOsc}, ${C.verde})`,
          padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: C.dorado, fontWeight: 900, fontSize: 16, margin: 0 }}>Panel del vendedor</p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, margin: "3px 0 0" }}>Los cambios se guardan para todos</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 18, display:"flex",alignItems:"center",justifyContent:"center" }}
          >×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: C.cremaDark, borderBottom: `2px solid ${C.beige}`, overflowX: "auto" }}>
          {secs.map((s) => (
            <button
              key={s.id}
              onClick={() => setSec(s.id)}
              style={{
                flex: "1 0 auto", padding: "11px 8px", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                background: sec === s.id ? C.blanco : "transparent",
                color: sec === s.id ? C.verdeOsc : C.textoSub,
                borderBottom: sec === s.id ? `2.5px solid ${C.verde}` : "2.5px solid transparent",
                marginBottom: -2, whiteSpace: "nowrap",
              }}
            >
              <div style={{ fontSize: 15 }}>{s.icon}</div>
              <div style={{ marginTop: 2 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

          {sec === "tienda" && <>
            <Input label="Nombre de la tienda" value={cfg.nombreTienda} onChange={(v) => setC("nombreTienda", v)} />
            <Input label="Eslogan" value={cfg.eslogan} onChange={(v) => setC("eslogan", v)} />
            <Input label="Ubicación (ciudad, barrio)" value={cfg.ubicacion || ""} onChange={(v) => setC("ubicacion", v)} placeholder="Neuquén, Plottier" />
            <Input label="WhatsApp (código país + número, sin +)" value={cfg.whatsapp} onChange={(v) => setC("whatsapp", v)} hint="Ej Argentina: 5492994000000" />
            <Input label="Símbolo de moneda" value={cfg.moneda} onChange={(v) => setC("moneda", v)} placeholder="$" />
            <Input label="Letras del logo (2-3 letras)" value={cfg.logoTexto} onChange={(v) => setC("logoTexto", v)} placeholder="CM" />
            <Input label="Texto del banner animado" value={cfg.bannerTexto} onChange={(v) => setC("bannerTexto", v)} />
            <Input label="Instagram (usuario, sin @)" value={cfg.instagram || ""} onChange={(v) => setC("instagram", v)} placeholder="confluencia.mates" />
            <Input label="Facebook (opcional)" value={cfg.facebook || ""} onChange={(v) => setC("facebook", v)} />
          </>}

          {sec === "hero" && <>
            <div style={{ background: C.cremaDark, borderRadius: 12, padding: 14, fontSize: 13, color: C.textoMed, lineHeight: 1.65, border: `1px solid ${C.beige}` }}>
              Cómo agregar tu foto: Subí tu imagen a <strong>imgur.com</strong>, hacé clic derecho → "Copiar dirección de imagen" y pegala abajo.
            </div>
            <Input
              label="URL de imagen del hero"
              value={cfg.heroImagenURL || ""}
              onChange={(v) => setC("heroImagenURL", v)}
              placeholder="https://i.imgur.com/tuimagen.jpg"
              hint="Dejá vacío para usar el fondo verde por defecto."
            />
          </>}

          {sec === "categorias" && <>
            <p style={{ fontSize: 13, color: C.textoSub }}>Cada categoría es una sección del menú (ej: Mates, Bombillas, Canastas).</p>
            {catKeys.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0", color: C.beigeOsc, fontSize: 13 }}>
                ¡Agregá tu primera categoría!
              </div>
            )}
            {catKeys.map((k) => (
              <div key={k} style={{ display: "flex", gap: 8, background: C.cremaDark, borderRadius: 12, padding: 10, alignItems: "center" }}>
                <input
                  value={cats[k].nombre}
                  onChange={(e) => setCatNombre(k, e.target.value)}
                  placeholder="Nombre de la categoría"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.beige}`, background: C.blanco, fontSize: 14, color: C.texto, fontFamily: "inherit", outline: "none" }}
                />
                <button
                  onClick={() => { setCatKey(k); setSec("productos"); }}
                  style={{ padding: "7px 12px", borderRadius: 8, background: C.verde, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}
                >Productos</button>
                <button
                  onClick={() => delCat(k)}
                  style={{ padding: "7px 10px", borderRadius: 8, background: "#fff0ec", color: C.rojo, border: `1px solid #fecaca`, cursor: "pointer" }}
                >✕</button>
              </div>
            ))}
            <button
              onClick={addCat}
              style={{ width: "100%", padding: 11, border: `2px dashed ${C.beigeOsc}`, borderRadius: 12, background: "none", color: C.textoSub, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >+ Nueva categoría</button>
          </>}

          {sec === "productos" && <>
            {catKeys.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.beigeOsc }}>
                <p style={{ fontWeight: 600, color: C.textoSub }}>Primero creá una categoría</p>
                <button onClick={() => setSec("categorias")} style={{ marginTop: 12, padding: "8px 18px", borderRadius: 10, background: C.verde, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
                  Ir a Categorías
                </button>
              </div>
            ) : <>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {catKeys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setCatKey(k)}
                    style={{ padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, background: catKey === k ? C.verde : C.cremaDark, color: catKey === k ? "#fff" : C.textoMed }}
                  >{cats[k].nombre || "Sin nombre"}</button>
                ))}
              </div>
              {catKey && cat && <>
                {Object.keys(cat.productos || {}).length === 0 && (
                  <p style={{ fontSize: 13, color: C.textoSub, textAlign: "center", padding: "12px 0" }}>Esta categoría no tiene productos.</p>
                )}
                {Object.entries(cat.productos || {}).map(([pk, prod]) => (
                  <div key={pk} style={{ background: C.cremaDark, borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={prod.nombre} onChange={(e) => setProd(pk, "nombre", e.target.value)} placeholder="Nombre del producto" style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.beige}`, background: C.blanco, fontSize: 14, color: C.texto, fontFamily: "inherit", outline: "none" }} />
                      <button onClick={() => delProd(pk)} style={{ padding: "7px 10px", borderRadius: 8, background: "#fff0ec", color: C.rojo, border: `1px solid #fecaca`, cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={prod.precio} onChange={(e) => setProd(pk, "precio", e.target.value)} placeholder="Precio" style={{ width: 120, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.beige}`, background: C.blanco, fontSize: 14, color: C.texto, fontFamily: "inherit", outline: "none" }} />
                      <input value={prod.descripcion} onChange={(e) => setProd(pk, "descripcion", e.target.value)} placeholder="Descripción breve" style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.beige}`, background: C.blanco, fontSize: 14, color: C.texto, fontFamily: "inherit", outline: "none" }} />
                    </div>
                    <input value={prod.imagenURL} onChange={(e) => setProd(pk, "imagenURL", e.target.value)} placeholder="URL de foto del producto (opcional)" style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.beige}`, background: C.blanco, fontSize: 13, color: C.texto, fontFamily: "inherit", outline: "none" }} />
                  </div>
                ))}
                <button onClick={addProd} style={{ width: "100%", padding: 11, border: `2px dashed ${C.beigeOsc}`, borderRadius: 12, background: "none", color: C.textoSub, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  + Agregar producto
                </button>
              </>}
            </>}
          </>}

          {sec === "clave" && <>
            <div style={{ background: "#fffbea", borderRadius: 12, padding: 14, fontSize: 13, color: C.textoMed, lineHeight: 1.65, border: `1px solid ${C.dorado}` }}>
              🔑 Acá podés cambiar la contraseña del panel. La nueva clave se guardará cuando toques <strong>"Guardar para todos"</strong>.
            </div>
            <Input
              label="Nueva contraseña (mínimo 6 caracteres)"
              type="password"
              value={nuevaClave}
              onChange={setNuevaClave}
              placeholder="Escribí la nueva contraseña"
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmarClave}
              onChange={setConfirmarClave}
              placeholder="Repetí la contraseña"
            />
            <button
              onClick={cambiarClave}
              style={{ padding: "10px 18px", borderRadius: 11, background: `linear-gradient(135deg, ${C.tierra}, ${C.verdeOsc})`, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
            >Aplicar nueva contraseña</button>
            {claveMsg && (
              <p style={{ fontSize: 13, fontWeight: 600, color: claveMsg.tipo === "ok" ? C.verde : "#ef4444", padding: "8px 12px", borderRadius: 8, background: claveMsg.tipo === "ok" ? "#f0fdf4" : "#fff5f5" }}>
                {claveMsg.txt}
              </p>
            )}
          </>}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${C.beige}`, display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: 10, borderRadius: 11, border: `1px solid ${C.beige}`, background: "none", color: C.textoMed, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 2, padding: 10, borderRadius: 11, background: saving ? C.beigeOsc : `linear-gradient(135deg, ${C.verde}, ${C.verdeOsc})`, color: "#fff", fontWeight: 800, border: "none", cursor: saving ? "default" : "pointer", fontFamily: "inherit", fontSize: 15 }}
          >{saving ? "Guardando..." : "Guardar para todos"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Menú hamburguesa ─────────────────────────────────────────────────────────
function MenuHamb({ cfg, cats, catKeys, onClose, onNav }) {
  const [subOpen, setSubOpen] = useState(false);

  const rowBase = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "15px 24px", cursor: "pointer", fontSize: 15, fontWeight: 500,
    color: C.texto, background: "none", border: "none", borderBottom: `1px solid ${C.cremaDark}`,
    width: "100%", textAlign: "left", fontFamily: "inherit",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(30,20,10,0.55)" }}>
      <style>{`@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.blanco, width: "85%", maxWidth: 320, height: "100%",
        display: "flex", flexDirection: "column",
        animation: "slideInLeft .25s ease",
        boxShadow: "8px 0 40px rgba(30,20,10,0.2)",
      }}>
        {/* Header menú */}
        <div style={{
          background: `linear-gradient(160deg, ${C.verdeOsc} 0%, ${C.verde} 55%, ${C.tierra} 100%)`,
          padding: "32px 22px 24px",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: `2px solid ${C.dorado}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: C.dorado, marginBottom: 14,
          }}>{cfg.logoTexto || "CM"}</div>
          <p style={{ color: C.dorado, fontWeight: 900, fontSize: 19, margin: 0 }}>
            {cfg.nombreTienda || "Confluencia Mate"}
          </p>
          {cfg.eslogan && <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "5px 0 0", fontStyle: "italic" }}>{cfg.eslogan}</p>}
          {cfg.ubicacion && (
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: "8px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
              📍 {cfg.ubicacion}
            </p>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto" }}>
          <button style={{ ...rowBase, fontWeight: 700 }} onClick={() => { onNav("inicio"); onClose(); }}>
            Inicio
          </button>
          <div>
            <button style={{ ...rowBase, fontWeight: 800 }} onClick={() => setSubOpen(!subOpen)}>
              <span>Productos</span>
              <span style={{ color: C.verde, fontSize: 18, display: "inline-block", transform: subOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
            </button>
            {subOpen && (
              <div style={{ background: C.cremaDark }}>
                <button style={{ ...rowBase, paddingLeft: 36, fontSize: 14, fontWeight: 700, color: C.verde, borderBottom: `1px solid ${C.beige}` }} onClick={() => { onNav("todos"); onClose(); }}>
                  Ver todos
                </button>
                {catKeys.length === 0 && <p style={{ padding: "10px 36px", fontSize: 12, color: C.beigeOsc }}>Sin categorías aún</p>}
                {catKeys.map((k) => (
                  <button key={k} style={{ ...rowBase, paddingLeft: 36, fontSize: 14, borderBottom: `1px solid ${C.beige}` }} onClick={() => { onNav(k); onClose(); }}>
                    {cats[k].nombre || "Categoría"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button style={{ ...rowBase, fontWeight: 700 }} onClick={() => { onNav("contacto"); onClose(); }}>
            Contacto
          </button>
          {cfg.instagram && (
            <a
              href={`https://www.instagram.com/${cfg.instagram}`}
              target="_blank"
              rel="noreferrer"
              style={{ ...rowBase, textDecoration: "none", display: "flex" }}
            >
              <span>Instagram</span>
              <span style={{ fontSize: 12, color: C.tierraMed }}>@{cfg.instagram}</span>
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}

// ─── Carrito ──────────────────────────────────────────────────────────────────
function Carrito({ items, moneda, whatsapp, nombreTienda, onRemove, onQty, onClear, onClose }) {
  const total = items.reduce((s, i) => s + (Number(i.precio) || 0) * i.cantidad, 0);

  function enviar() {
    if (!items.length) return;
    let msg = `Pedido - ${nombreTienda || "Confluencia Mate"}\n\n`;
    items.forEach((i) => {
      msg += `- ${i.nombre} x${i.cantidad} = ${moneda}${(Number(i.precio) * i.cantidad).toLocaleString()}\n`;
    });
    msg += `\nTotal: ${moneda}${total.toLocaleString()}\n\n¡Hola! Quiero hacer este pedido 🧉`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(30,20,10,0.55)", display: "flex", justifyContent: "flex-end" }}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.blanco, width: "100%", maxWidth: 380, height: "100%",
        display: "flex", flexDirection: "column",
        animation: "slideIn .25s ease",
        boxShadow: "-8px 0 40px rgba(30,20,10,0.2)",
      }}>
        <div style={{ background: `linear-gradient(135deg, ${C.verdeOsc}, ${C.verde})`, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: C.dorado, fontWeight: 900, fontSize: 18 }}>Mi pedido 🧉</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 18, display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: C.beigeOsc }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🧉</div>
              <p style={{ fontWeight: 700, color: C.textoSub }}>Tu carrito está vacío</p>
              <p style={{ fontSize: 13, color: C.beigeOsc, marginTop: 6 }}>Agregá productos para hacer tu pedido</p>
            </div>
          ) : items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 12, background: C.cremaDark, borderRadius: 14, padding: 12, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: C.beige, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.imagenURL
                  ? <img src={item.imagenURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                  : <span style={{ fontSize: 22 }}>🧉</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0, color: C.texto, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.nombre}</p>
                <p style={{ color: C.textoSub, fontSize: 12, margin: "3px 0 0" }}>{moneda}{Number(item.precio).toLocaleString()} c/u</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => onQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${C.verde}`, background: "none", color: C.verde, fontWeight: 800, cursor: "pointer", fontSize: 16, display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.cantidad}</span>
                <button onClick={() => onQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: C.verde, border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 16, display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ color: "#fca5a5", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "16px 18px", borderTop: `1.5px solid ${C.beige}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 19, marginBottom: 14, color: C.texto }}>
              <span>Total</span>
              <span style={{ color: C.verdeOsc }}>{moneda}{total.toLocaleString()}</span>
            </div>
            <button onClick={enviar} style={{ width: "100%", padding: "14px", borderRadius: 14, background: C.wsp, color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit" }}>
              Pedir por WhatsApp 💬
            </button>
            <button onClick={onClear} style={{ width: "100%", marginTop: 8, padding: 8, background: "none", border: "none", color: C.textoSub, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de producto ──────────────────────────────────────────────────────
function Tarjeta({ prod, prodId, moneda, onAgregar }) {
  const [agregado, setAgregado] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.blanco,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${hover ? C.tierraSub : C.beige}`,
        boxShadow: hover ? `0 16px 40px rgba(100,50,20,0.18)` : `0 2px 10px rgba(30,20,10,0.07)`,
        transform: hover ? "translateY(-5px)" : "none",
        transition: "all .22s ease",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Imagen */}
      <div style={{
        width: "100%", height: 190,
        background: `linear-gradient(135deg, ${C.cremaDark}, ${C.beige})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", flexShrink: 0, position: "relative",
      }}>
        {prod.imagenURL
          ? <img src={prod.imagenURL} alt={prod.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
          : <span style={{ fontSize: 52, opacity: 0.25 }}>🧉</span>}
      </div>

      {/* Info */}
      <div style={{ padding: "13px 14px 15px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 5px", color: C.texto, lineHeight: 1.3, flex: 1 }}>
          {prod.nombre || "Producto"}
        </p>
        {prod.descripcion && (
          <p style={{ color: C.textoSub, fontSize: 12, margin: "0 0 10px", lineHeight: 1.45 }}>{prod.descripcion}</p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: C.verdeOsc }}>
            {moneda}{Number(prod.precio).toLocaleString() || "—"}
          </span>
          <button
            onClick={() => { onAgregar({ ...prod, id: prodId }); setAgregado(true); setTimeout(() => setAgregado(false), 1300); }}
            style={{
              padding: "8px 14px", borderRadius: 10,
              background: agregado
                ? "#bbf7d0"
                : `linear-gradient(135deg, ${C.verde}, ${C.verdeOsc})`,
              color: agregado ? C.verdeOsc : "#fff",
              fontWeight: 700, fontSize: 12, border: "none",
              cursor: "pointer", transition: "all .2s", fontFamily: "inherit",
            }}
          >{agregado ? "✓ Agregado" : "+ Agregar"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const { data, guardar, loading } = useFirebaseData();

  const [vista, setVista] = useState("inicio");
  const [carrito, setCarrito] = useState([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showClave, setShowClave] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const cfg = data.config || DATA_INICIAL.config;
  const cats = data.categorias || {};
  const catKeys = Object.keys(cats);
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);
  const claveGuardada = data.clave || CLAVE_DEFAULT;

  function agregar(prod) {
    setCarrito((prev) => {
      const ex = prev.find((i) => i.id === prod.id);
      if (ex) return prev.map((i) => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...prod, cantidad: 1 }];
    });
  }
  function updateQty(id, d) {
    setCarrito((p) => p.map((i) => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + d) } : i));
  }
  function remover(id) {
    setCarrito((p) => p.filter((i) => i.id !== id));
  }

  // Productos según vista
  let productos = [];
  let tituloVista = "";
  if (vista === "todos") {
    productos = catKeys.reduce((acc, k) => acc.concat(Object.entries(cats[k].productos || {}).map(([pk, p]) => ({ ...p, pk }))), []);
    tituloVista = "Todos los productos";
  } else if (vista !== "inicio" && vista !== "contacto") {
    const catActual = cats[vista];
    if (catActual) {
      productos = Object.entries(catActual.productos || {}).map(([pk, p]) => ({ ...p, pk }));
      tituloVista = catActual.nombre;
    }
  }
  const todosProd = catKeys.reduce((acc, k) => acc.concat(Object.entries(cats[k].productos || {}).map(([pk, p]) => ({ ...p, pk }))), []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.crema, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 52 }}>🧉</div>
        <p style={{ color: C.textoSub, fontSize: 17 }}>Cargando Confluencia Mate...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.crema, fontFamily: "'Georgia', 'Palatino', serif" }}>
      <style>{`
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes bannerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.crema}}
      `}</style>

      {/* Banner animado */}
      {cfg.bannerTexto && (
        <div style={{ background: C.verdeOsc, color: C.dorado, overflow: "hidden", height: 32, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", animation: "bannerScroll 28s linear infinite", whiteSpace: "nowrap" }}>
            {[1,2,3,4].map((n) => (
              <span key={n} style={{ padding: "0 40px", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em" }}>
                {cfg.bannerTexto}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: C.blanco,
        borderBottom: `1px solid ${C.beige}`,
        position: "sticky", top: 0, zIndex: 40,
        boxShadow: "0 2px 20px rgba(30,20,10,0.08)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Hamburguesa */}
          <button onClick={() => setShowMenu(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            {[1,2,3].map((n) => <div key={n} style={{ width: 22, height: 2.5, background: C.verdeOsc, borderRadius: 2 }} />)}
          </button>

          {/* Logo */}
          <button onClick={() => setVista("inicio")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.verdeOsc} 0%, ${C.verde} 50%, ${C.tierra} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, color: C.dorado,
              boxShadow: `0 3px 12px rgba(30,90,30,0.3)`,
              border: `2px solid ${C.dorado}`,
            }}>{cfg.logoTexto || "CM"}</div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: 900, fontSize: 16, color: C.verdeOsc, margin: 0, letterSpacing: "-0.01em" }}>
                {cfg.nombreTienda || "Confluencia Mate"}
              </p>
              {cfg.eslogan && (
                <p style={{ fontSize: 10, color: C.textoSub, margin: "1px 0 0", fontStyle: "italic" }}>{cfg.eslogan}</p>
              )}
            </div>
          </button>

          {/* Acciones */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => setShowClave(true)}
              style={{ background: C.cremaDark, border: `1px solid ${C.beige}`, borderRadius: 10, padding: "7px 11px", fontSize: 13, cursor: "pointer", color: C.textoMed, fontFamily: "inherit" }}
            >⚙</button>
            <button
              onClick={() => setShowCarrito(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8 }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.verdeOsc} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx={9} cy={21} r={1} />
                <circle cx={20} cy={21} r={1} />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: 3, right: 3, background: C.tierra, color: "#fff", borderRadius: "50%", width: 17, height: 17, fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Vista inicio ── */}
      {vista === "inicio" && (
        <>
          {/* Hero */}
          <div style={{ position: "relative", height: "clamp(300px,55vw,520px)", overflow: "hidden" }}>
            {cfg.heroImagenURL
              ? <img src={cfg.heroImagenURL} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${C.verdeOsc} 0%, ${C.verde} 45%, ${C.tierra} 100%)` }}>
                  {/* Textura decorativa */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(212,168,67,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,94,60,0.2) 0%, transparent 50%)" }} />
                </div>
              )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(30,20,10,0.78) 0%, rgba(30,20,10,0.4) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(24px,5vw,60px)", animation: "fadeUp .7s ease" }}>
              <p style={{ color: C.dorado, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12, fontFamily: "sans-serif" }}>
                Bienvenido a
              </p>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(30px,6vw,68px)", lineHeight: 1.08, marginBottom: 10, textShadow: "0 2px 30px rgba(0,0,0,0.4)", maxWidth: 620 }}>
                {cfg.nombreTienda || "Confluencia Mate"}
              </h1>
              {cfg.eslogan && (
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(14px,2vw,18px)", fontStyle: "italic", marginBottom: cfg.ubicacion ? 8 : 24 }}>
                  {cfg.eslogan}
                </p>
              )}
              {cfg.ubicacion && (
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 24, fontFamily: "sans-serif" }}>
                  📍 {cfg.ubicacion}
                </p>
              )}
              {todosProd.length > 0 && (
                <button
                  onClick={() => setVista("todos")}
                  style={{ padding: "13px 30px", background: C.dorado, color: C.verdeOsc, borderRadius: 999, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(212,168,67,0.4)" }}
                >Ver productos →</button>
              )}
            </div>
          </div>

          {/* Chips de categorías */}
          {catKeys.length > 0 && (
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 0", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setVista("todos")}
                style={{ padding: "8px 18px", borderRadius: 999, border: `2px solid ${C.verde}`, background: "none", color: C.verde, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}
              >Todos</button>
              {catKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setVista(k)}
                  style={{ padding: "8px 18px", borderRadius: 999, border: `2px solid ${C.beige}`, background: C.blanco, color: C.textoMed, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}
                >{cats[k].nombre}</button>
              ))}
            </div>
          )}

          {/* Setup inicial si no hay productos */}
          {catKeys.length === 0 && (
            <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px" }}>
              <div style={{ background: C.blanco, borderRadius: 22, padding: "36px 30px", border: `2px dashed ${C.beige}`, textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🧉</div>
                <h2 style={{ fontWeight: 900, fontSize: 26, color: C.verdeOsc, marginBottom: 12 }}>¡Configurá tu tienda!</h2>
                <p style={{ color: C.textoSub, lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
                  Tocá el botón para agregar tus productos, precios y fotos.
                </p>
                <button
                  onClick={() => setShowClave(true)}
                  style={{ padding: "14px 32px", background: `linear-gradient(135deg, ${C.verde}, ${C.verdeOsc})`, color: C.dorado, borderRadius: 14, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >Configurar mi tienda</button>
              </div>
            </div>
          )}

          {/* Productos destacados */}
          {todosProd.length > 0 && (
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 16px 64px" }}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontWeight: 900, fontSize: "clamp(24px,4vw,36px)", color: C.verdeOsc, marginBottom: 8 }}>Destacados</h2>
                <div style={{ width: 48, height: 3, background: `linear-gradient(90deg, ${C.tierra}, ${C.dorado})`, borderRadius: 2, margin: "0 auto" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 16 }}>
                {todosProd.slice(0, 6).map((prod) => (
                  <Tarjeta key={prod.pk} prod={prod} prodId={prod.pk} moneda={cfg.moneda} onAgregar={agregar} />
                ))}
              </div>
            </div>
          )}

          {/* Info de contacto rápida */}
          <div style={{ background: `linear-gradient(135deg, ${C.verdeOsc}, ${C.verde} 50%, ${C.tierra})`, padding: "40px 20px", textAlign: "center" }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <p style={{ color: C.dorado, fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
                {cfg.nombreTienda || "Confluencia Mate"}
              </p>
              {cfg.ubicacion && (
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 }}>📍 {cfg.ubicacion}</p>
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {cfg.whatsapp && (
                  <a
                    href={`https://wa.me/${cfg.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: C.wsp, color: "#fff", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "sans-serif" }}
                  >WhatsApp</a>
                )}
                {cfg.instagram && (
                  <a
                    href={`https://www.instagram.com/${cfg.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "sans-serif", border: "1px solid rgba(255,255,255,0.25)" }}
                  >@{cfg.instagram}</a>
                )}
              </div>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 28 }}>Hecho con amor y mate 🧉</p>
            </div>
          </div>
        </>
      )}

      {/* ── Vista productos / categoría ── */}
      {vista !== "inicio" && vista !== "contacto" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30 }}>
            <button onClick={() => setVista("inicio")} style={{ background: "none", border: "none", color: C.verde, fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "inherit" }}>
              Inicio
            </button>
            <span style={{ color: C.beige }}>›</span>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(20px,4vw,32px)", color: C.verdeOsc }}>{tituloVista}</h2>
          </div>
          {productos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: C.beigeOsc }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ fontWeight: 600, color: C.textoSub }}>No hay productos en esta categoría aún</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 16 }}>
              {productos.map((prod) => (
                <Tarjeta key={prod.pk} prod={prod} prodId={prod.pk} moneda={cfg.moneda} onAgregar={agregar} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Vista contacto ── */}
      {vista === "contacto" && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontWeight: 900, fontSize: 34, marginBottom: 12, color: C.verdeOsc }}>Contacto</h2>
          {cfg.ubicacion && <p style={{ color: C.textoSub, marginBottom: 8 }}>📍 {cfg.ubicacion}</p>}
          <p style={{ color: C.textoSub, marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
            Escribinos por WhatsApp o Instagram y te respondemos!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {cfg.whatsapp && (
              <a href={`https://wa.me/${cfg.whatsapp}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: C.wsp, color: "#fff", borderRadius: 16, fontWeight: 800, fontSize: 18, textDecoration: "none", fontFamily: "inherit", width: "100%", justifyContent: "center" }}>
                WhatsApp
              </a>
            )}
            {cfg.instagram && (
              <a href={`https://www.instagram.com/${cfg.instagram}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: `linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)`, color: "#fff", borderRadius: 16, fontWeight: 800, fontSize: 18, textDecoration: "none", fontFamily: "inherit", width: "100%", justifyContent: "center" }}>
                @{cfg.instagram}
              </a>
            )}
          </div>
          <button onClick={() => setVista("inicio")} style={{ display: "block", margin: "28px auto 0", background: "none", border: "none", color: C.verde, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
            ← Volver
          </button>
        </div>
      )}

      {/* Modales */}
      {showMenu && (
        <MenuHamb cfg={cfg} cats={cats} catKeys={catKeys} onClose={() => setShowMenu(false)} onNav={setVista} />
      )}
      {showCarrito && (
        <Carrito
          items={carrito}
          moneda={cfg.moneda}
          whatsapp={cfg.whatsapp}
          nombreTienda={cfg.nombreTienda}
          onRemove={remover}
          onQty={updateQty}
          onClear={() => setCarrito([])}
          onClose={() => setShowCarrito(false)}
        />
      )}
      {showClave && (
        <ModalClave
          claveGuardada={claveGuardada}
          onSuccess={() => { setShowClave(false); setShowAdmin(true); }}
          onClose={() => setShowClave(false)}
        />
      )}
      {showAdmin && (
        <PanelAdmin data={data} onSave={guardar} onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}
