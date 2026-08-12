// src/pages/Home.jsx
// Diseño mejorado para SoftyHealth — inspirado en Klinea
// Requiere: lucide-react  (ya incluido en el zip)
// Imágenes: usa Unsplash URLs — reemplaza bg01.jpg si quieres imagen local

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Heart, Shield, Activity, Clock,
  CheckCircle, Calendar, FileText, Bell, Menu, X, ChevronDown
} from "lucide-react";

// ── Paleta SoftyHealth ────────────────────────────────────────────────────────
const C = {
  primary:    "#0A76D8",
  primaryDark:"#085FAD",
  primaryBg:  "#E8F0FE",
  white:      "#FFFFFF",
  bg:         "#F8FAFD",
  text:       "#0F1E2E",
  muted:      "#64748B",
  border:     "rgba(10,118,216,0.12)",
};

const NAV_LINKS = ["Servicios", "Especialistas", "Cómo funciona", "Contacto"];

const STATS = [
  { value: "98%",  label: "Pacientes satisfechos" },
  { value: "500+", label: "Médicos certificados" },
  { value: "24h",  label: "Soporte disponible" },
  { value: "12",   label: "Especialidades" },
];

const SERVICES = [
  { icon: Heart,    title: "Medicina general",   body: "Consultas presenciales y en línea con médicos certificados. Diagnóstico oportuno y seguimiento personalizado." },
  { icon: Activity, title: "Salud mental",        body: "Psicólogos y psiquiatras disponibles. Terapia individual, de pareja y gestión de crisis." },
  { icon: Shield,   title: "Medicina preventiva", body: "Chequeos periódicos y planes de prevención adaptados a tu historial clínico." },
  { icon: Clock,    title: "Urgencias",           body: "Atención rápida para situaciones urgentes sin listas de espera." },
];

const STEPS = [
  { num: "01", icon: Calendar,  title: "Elige tu especialista", body: "Filtra por especialidad, disponibilidad y valoraciones." },
  { num: "02", icon: CheckCircle,title: "Reserva en segundos",  body: "Selecciona fecha y hora. Confirmación inmediata por correo." },
  { num: "03", icon: FileText,  title: "Consulta y seguimiento",body: "Historial clínico digitalizado. Accede a tus registros en cualquier momento." },
  { num: "04", icon: Bell,      title: "Recordatorios",         body: "Notificaciones automáticas para que nunca olvides tu cita." },
];

const TEAM = [
  { name: "Dra. Elena Vargas",  role: "Directora Médica · Internista",   img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=480&fit=crop" },
  { name: "Dr. Marcos Ibáñez",  role: "Cardiología",                      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=480&fit=crop" },
  { name: "Dra. Sara Delgado",  role: "Psicología clínica",               img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=480&fit=crop" },
];

const FAQS = [
  { q: "¿Necesito seguro médico?",           a: "No. Aceptamos pago directo y la mayoría de seguros privados." },
  { q: "¿Cómo agendo una cita en línea?",    a: "Regístrate, elige especialista, selecciona hora y confirma. Recibirás confirmación por correo en segundos." },
  { q: "¿Puedo ver mi historial clínico?",   a: "Sí. Tu historial está disponible 24/7 desde tu perfil con total seguridad." },
  { q: "¿Cuánto demora una derivación?",     a: "En la mayoría de casos, menos de 48 horas. Los casos urgentes se gestionan el mismo día." },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function Home() {
  const navigate   = useNavigate();
  const [menu,     setMenu]   = useState(false);
  const [openFaq,  setOpenFaq]= useState(null);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>



      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 128, paddingBottom: 80, maxWidth: 1152, margin: "0 auto", padding: "128px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "center" }}>

          {/* Texto */}
          <div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 700, color: C.primary,
              background: C.primaryBg, padding: "6px 14px", borderRadius: 99, marginBottom: 28,
              letterSpacing: "0.5px", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary }} />
              Sistema de citas médicas
            </span>

            <h1 style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 900,
              lineHeight: 1.05, color: C.text, marginBottom: 20,
              letterSpacing: "-1.5px", fontFamily: "'Manrope','Inter',sans-serif",
            }}>
              Gestiona tu salud<br />
              <span style={{ color: C.primary }}>desde cualquier lugar</span>
            </h1>

            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
              Agenda citas con especialistas certificados, accede a tu historia clínica digital
              y recibe atención médica profesional — sin filas de espera.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <button onClick={() => navigate("/login")}
                style={{ padding: "13px 26px", background: C.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                Agenda tu cita <ArrowRight size={16} />
              </button>

            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
              <CheckCircle size={15} color={C.primary} />
              Plataforma segura · Historia clínica conforme a Res. 1995/1999
            </div>
          </div>

          {/* Imagen hero */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "4/5", background: C.primaryBg }}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=620&fit=crop&auto=format"
                alt="Médico en consulta"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Floating card */}
            <div style={{
              position: "absolute", bottom: -16, left: -24,
              background: "#fff", borderRadius: 14, padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(10,118,216,0.15)",
              border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={16} color={C.primary} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>98% satisfacción</div>
                <div style={{ fontSize: 11, color: C.muted }}>+500 médicos certificados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 72, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.primary, fontFamily: "'Manrope',sans-serif", letterSpacing: "-1px" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICIOS ───────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: `1px solid ${C.border}`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ marginBottom: 52, maxWidth: 520 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 12 }}>
              Nuestros servicios
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: 900, color: C.text, lineHeight: 1.15, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.5px" }}>
              Atención integral en un solo lugar.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{
                borderRadius: 14, padding: 24, border: `1px solid ${C.border}`,
                background: C.bg, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 4px 20px rgba(10,118,216,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <s.icon size={20} color={C.primary} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: "'Manrope',sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{s.body}</p>
                <span style={{ fontSize: 12, color: C.primary, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  Saber más <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 12 }}>
              Cómo funciona
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: 900, color: C.text, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.5px" }}>
              Tu cita en 4 pasos simples.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-flex", marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 1 ? C.primary : C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <step.icon size={24} color={i === 1 ? "#fff" : C.primary} />
                  </div>
                  <span style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: C.primary, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.num.slice(1)}
                  </span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: "'Manrope',sans-serif" }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
            borderRadius: 20, overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 260,
          }}>
            <div style={{ padding: "56px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 16, fontFamily: "'Manrope',sans-serif" }}>
                Tu primera consulta, sin costo.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 380 }}>
                Conoce a tu médico antes de comprometerte. Sin permanencia, sin sorpresas.
              </p>
              <button onClick={() => navigate("/login")}
                style={{ padding: "12px 24px", background: "#fff", color: C.primary, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start" }}>
                Registrarme gratis <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1666214280391-8ff5bd3d9bf9?w=600&h=400&fit=crop"
                alt="Teleconsulta"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 12 }}>FAQ</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: C.text, fontFamily: "'Manrope',sans-serif" }}>
            Lo que más nos preguntan.
          </h2>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", textAlign: "left", background: "none", border: "none", cursor: "pointer", gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Manrope',sans-serif" }}>{faq.q}</span>
                <ChevronDown size={16} color={C.muted} style={{ transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, background: "#fff" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.text, fontFamily: "'Manrope',sans-serif" }}>SoftyHealth</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 260 }}>
              Plataforma de gestión de citas médicas. Atención profesional, historial digital y seguridad de datos.
            </p>
          </div>
          {[
            { h: "Servicios",  links: ["Medicina general", "Salud mental", "Preventiva", "Urgencias"] },
            { h: "Plataforma", links: ["Registrarse", "Iniciar sesión", "Para médicos", "Contacto"] },
            { h: "Legal",      links: ["Privacidad", "Términos de uso", "Res. 1995/1999", "Cookies"] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>{col.h}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}
                      onMouseEnter={e => e.target.style.color = C.primary}
                      onMouseLeave={e => e.target.style.color = C.muted}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, maxWidth: 1152, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.muted }}>© 2026 SoftyHealth · Todos los derechos reservados</span>
          <span style={{ fontSize: 12, color: C.muted }}>Conforme a Resolución 1995 de 1999 · Ministerio de Salud Colombia</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          section > div { grid-template-columns: 1fr !important; }
          section > div > div:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}