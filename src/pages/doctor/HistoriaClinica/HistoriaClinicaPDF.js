// src/utils/HistoriaClinicaPDF.js
// Requiere: npm install jspdf jspdf-autotable
// o: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js">

import jsPDF from "jspdf";
import "jspdf-autotable";

const PRIMARY   = [10, 118, 216];   // #0A76D8
const DARK      = [33, 37, 41];     // #212529
const MUTED     = [102, 102, 102];  // #666
const LIGHT_BG  = [245, 247, 250];  // #f5f7fa
const WHITE     = [255, 255, 255];

// ── Helper: cabecera institucional ───────────────────────────────────────────
function drawHeader(doc, title) {
  const w = doc.internal.pageSize.getWidth();

  // Barra azul superior
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, w, 18, "F");

  // Logo / nombre
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("SoftyHealth", 14, 12);

  // Título a la derecha
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(title, w - 14, 12, { align: "right" });

  // Línea decorativa
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(0, 18, w, 18);

  return 24; // y de inicio del contenido
}

// ── Helper: pie de página ────────────────────────────────────────────────────
function drawFooter(doc, pageNum, totalPages) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(14, h - 14, w - 14, h - 14);

  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Documento generado conforme a la Resolución 1995 de 1999 — Ministerio de Salud Colombia",
    14, h - 8
  );
  doc.text(`Página ${pageNum} de ${totalPages}`, w - 14, h - 8, { align: "right" });
}

// ── Helper: sección con título ────────────────────────────────────────────────
function drawSection(doc, title, y) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...LIGHT_BG);
  doc.rect(14, y, w - 28, 7, "F");
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), 16, y + 5);
  return y + 10;
}

// ── Helper: campo clave-valor ─────────────────────────────────────────────────
function drawField(doc, label, value, x, y, colW = 85) {
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text(label + ":", x, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  const lines = doc.splitTextToSize(value || "—", colW - 2);
  doc.text(lines, x + 28, y);
  return y + lines.length * 4.5;
}

// ── Helper: texto largo ───────────────────────────────────────────────────────
function drawLongField(doc, label, value, y) {
  const w = doc.internal.pageSize.getWidth();
  if (!value) return y;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text(label + ":", 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  const lines = doc.splitTextToSize(value, w - 28);
  doc.text(lines, 14, y);
  return y + lines.length * 4.5 + 3;
}

// ── Helper: signos vitales ────────────────────────────────────────────────────
function drawSignosVitales(doc, sv, y) {
  if (!sv) return y;
  const campos = [
    ["T.A.", sv.presion_arterial],
    ["FC", sv.frecuencia_cardiaca ? sv.frecuencia_cardiaca + " lpm" : null],
    ["FR", sv.frecuencia_respiratoria ? sv.frecuencia_respiratoria + " rpm" : null],
    ["Temp", sv.temperatura ? sv.temperatura + " °C" : null],
    ["Peso", sv.peso_kg ? sv.peso_kg + " kg" : null],
    ["Talla", sv.talla_cm ? sv.talla_cm + " cm" : null],
    ["SatO₂", sv.saturacion_o2 ? sv.saturacion_o2 + "%" : null],
  ].filter(([, v]) => v);

  if (!campos.length) return y;

  const w   = doc.internal.pageSize.getWidth();
  const colW = (w - 28) / campos.length;

  campos.forEach(([label, val], i) => {
    const x = 14 + i * colW;
    doc.setFillColor(232, 240, 254);
    doc.roundedRect(x, y, colW - 2, 12, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text(label, x + (colW - 2) / 2, y + 4.5, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(val, x + (colW - 2) / 2, y + 10, { align: "center" });
  });

  return y + 16;
}

// ── FUNCIÓN PRINCIPAL: Historia completa ─────────────────────────────────────
export function generarPDFHistoriaCompleta(historia, registros) {
  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w    = doc.internal.pageSize.getWidth();
  let   y    = drawHeader(doc, "HISTORIA CLÍNICA");

  // ── Datos del paciente (Art. 9) ───────────────────────────────────────────
  y = drawSection(doc, "Identificación del paciente — Art. 9 Res. 1995/1999", y);

  const col1 = 14, col2 = w / 2 + 5;

  drawField(doc, "Nombre",      historia.paciente,       col1, y);
  drawField(doc, "Documento",   `${historia.tipo_documento}: ${historia.pdocument ?? "—"}`, col2, y);
  y += 6;
  drawField(doc, "Fecha nac.",  historia.pbirthdate ?? "—", col1, y);
  drawField(doc, "Teléfono",    historia.pphone     ?? "—", col2, y);
  y += 6;
  drawField(doc, "Dirección",   historia.address    ?? "—", col1, y, 90);
  drawField(doc, "Correo",      historia.pemail     ?? "—", col2, y);
  y += 8;

  // Datos de la HC
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text(`N° Historia: HC-${historia.hc_id}`, col1, y);
  doc.text(`Fecha apertura: ${historia.fecha_apertura}`, col2, y);
  y += 8;

  // ── Registros ─────────────────────────────────────────────────────────────
  const activos = registros.filter(r => !r.anulado);

  activos.forEach((r, idx) => {
    // Nueva página si no hay espacio
    if (y > 240) {
      doc.addPage();
      y = drawHeader(doc, "HISTORIA CLÍNICA — continuación");
    }

    // Cabecera del registro
    doc.setFillColor(...PRIMARY);
    doc.rect(14, y, w - 28, 8, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Registro ${idx + 1} — ${r.fecha_registro}  ${r.hora_registro?.slice(0, 5) ?? ""}  |  Dr. ${r.doctor_nombre}`,
      16, y + 5.5
    );
    y += 11;

    // Signos vitales
    if (r.signos_vitales) {
      const sv = typeof r.signos_vitales === "string"
        ? JSON.parse(r.signos_vitales) : r.signos_vitales;
      y = drawSignosVitales(doc, sv, y);
      y += 2;
    }

    // Campos del registro
    y = drawLongField(doc, "Motivo de consulta",  r.motivo_consulta,  y);
    y = drawLongField(doc, "Anamnesis",            r.anamnesis,        y);
    y = drawLongField(doc, "Examen físico",        r.examen_fisico,    y);
    y = drawLongField(doc, "Diagnóstico",
      r.diagnostico + (r.cie10_codigo ? ` (CIE-10: ${r.cie10_codigo})` : ""), y);
    y = drawLongField(doc, "Plan de manejo",       r.plan_manejo,      y);
    y = drawLongField(doc, "Evolución",            r.evolucion,        y);
    y = drawLongField(doc, "Observaciones",        r.observaciones,    y);

    // Separador
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, y, w - 14, y);
    y += 6;
  });

  // Firma al final
  if (y > 220) { doc.addPage(); y = drawHeader(doc, "HISTORIA CLÍNICA — firma"); }
  y += 10;
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.4);
  doc.line(14, y, 80, y);
  doc.line(w / 2 + 5, y, w - 14, y);
  y += 4;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Firma del médico", 14, y);
  doc.text("Firma del paciente", w / 2 + 5, y);

  // Pie de página en todas las páginas
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`HC_${historia.paciente?.replace(/\s+/g, "_")}_${historia.fecha_apertura}.pdf`);
}

// ── FUNCIÓN: Un solo registro ─────────────────────────────────────────────────
export function generarPDFRegistro(historia, registro) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w   = doc.internal.pageSize.getWidth();
  let   y   = drawHeader(doc, "REGISTRO CLÍNICO");

  // Datos del paciente
  y = drawSection(doc, "Datos del paciente", y);
  drawField(doc, "Nombre",     historia.paciente,    14,          y);
  drawField(doc, "Documento",  `${historia.tipo_documento}: ${historia.pdocument ?? "—"}`, w / 2 + 5, y);
  y += 6;
  drawField(doc, "Fecha nac.", historia.pbirthdate ?? "—", 14,   y);
  drawField(doc, "Teléfono",   historia.pphone ?? "—", w / 2 + 5, y);
  y += 10;

  // Datos de la consulta
  y = drawSection(doc, "Datos de la consulta", y);
  drawField(doc, "Fecha",   registro.fecha_registro,              14,          y);
  drawField(doc, "Hora",    registro.hora_registro?.slice(0, 5),  w / 2 + 5,  y);
  y += 6;
  drawField(doc, "Médico",  registro.doctor_nombre,               14,          y);
  drawField(doc, "HC N°",   `HC-${historia.hc_id}`,               w / 2 + 5,  y);
  y += 10;

  // Signos vitales
  const sv = typeof registro.signos_vitales === "string"
    ? JSON.parse(registro.signos_vitales) : registro.signos_vitales;

  if (sv && Object.values(sv).some(v => v)) {
    y = drawSection(doc, "Signos vitales", y);
    y = drawSignosVitales(doc, sv, y);
    y += 4;
  }

  // Campos clínicos
  y = drawSection(doc, "Registro clínico", y);
  y = drawLongField(doc, "Motivo de consulta",  registro.motivo_consulta,  y);
  y = drawLongField(doc, "Anamnesis",            registro.anamnesis,        y);
  y = drawLongField(doc, "Examen físico",        registro.examen_fisico,    y);
  y = drawLongField(doc, "Diagnóstico",
    registro.diagnostico + (registro.cie10_codigo ? ` (CIE-10: ${registro.cie10_codigo})` : ""), y);
  y = drawLongField(doc, "Plan de manejo",       registro.plan_manejo,      y);
  y = drawLongField(doc, "Evolución",            registro.evolucion,        y);
  y = drawLongField(doc, "Observaciones",        registro.observaciones,    y);

  // Firma
  y = Math.max(y + 10, 230);
  if (y > 250) { doc.addPage(); y = 30; }
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.4);
  doc.line(14, y, 80, y);
  doc.line(w / 2 + 5, y, w - 14, y);
  y += 4;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Firma del médico tratante", 14, y);
  doc.text("Firma del paciente", w / 2 + 5, y);

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Registro_${historia.paciente?.replace(/\s+/g, "_")}_${registro.fecha_registro}.pdf`);
}