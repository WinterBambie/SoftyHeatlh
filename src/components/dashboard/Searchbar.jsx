import { useState, useRef, useEffect } from "react";
import { Search, Close } from "@mui/icons-material";
/**
 * Barra de búsqueda reutilizable.
 *
 * Props:
 *   data        — array de objetos a filtrar
 *   keys        — campos del objeto donde buscar, ej: ["pname", "pemail"]
 *   onResults   — callback con el array filtrado
 *   placeholder — texto del input
 *   renderItem  — función (item) => JSX para el dropdown de sugerencias (opcional)
 */
function SearchBar({ data = [], keys = [], onResults, placeholder = "Buscar...", renderItem }) {
  const [query,    setQuery]    = useState("");
  const [open,     setOpen]     = useState(false);
  const [focused,  setFocused]  = useState(false);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  const normalize = (str) =>
    String(str ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const filter = (q) => {
  if (!q.trim()) return data;
  if (!keys.length) return data;

  const nq = normalize(q);

  return data.filter(item =>
    keys.some(key => normalize(item[key] ?? "").includes(nq))
  );
};

  useEffect(() => {
    const results = filter(query);
    onResults(results);
  }, [query, data]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions = query.trim() ? filter(query).slice(0, 6) : [];

  const handleSelect = (item) => {
    onResults([item]);
    setQuery(keys[0] ? String(item[keys[0]] ?? "") : "");
    setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onResults(data);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${focused ? "var(--primarycolor)" : "var(--bordercolor)"}`,
        borderRadius: "10px", backgroundColor: "#fff",
        padding: "0 0.75rem", gap: "8px",
        transition: "border-color 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(10,118,216,0.1)" : "none",
      }}>
        <Search style={{ color: focused ? "var(--primarycolor)" : "#aaa", fontSize: "18px" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: "14px", color: "var(--textcolor)",
            backgroundColor: "transparent", padding: "0.6rem 0",
          }}
        />
        {query && (
          <button onClick={handleClear} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#aaa", padding: 0, display: "flex", alignItems: "center",
          }}>
            <Close style={{ fontSize: "16px" }} />
          </button>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {open && renderItem && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          backgroundColor: "#fff", borderRadius: "10px",
          border: "1px solid var(--bordercolor)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          zIndex: 200, overflow: "hidden",
        }}>
          {suggestions.map((item, i) => (
            <div key={i} onMouseDown={() => handleSelect(item)} style={{
              padding: "0.65rem 1rem", cursor: "pointer",
              borderBottom: i < suggestions.length - 1 ? "1px solid var(--bordercolor)" : "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5F7FA"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;