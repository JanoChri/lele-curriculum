import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, X, AlertTriangle, CalendarDays, Layers, Users, CheckCircle2, Clock3, Plus, Pencil, Upload, FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const COMPETENCY_AREAS = {
  sozial: { label: "Soziale Kompetenz / Kooperationskompetenz", accent: "border-l-sky-500", dot: "bg-sky-500" },
  lernen: { label: "Lernkompetenz", accent: "border-l-amber-400", dot: "bg-amber-400" },
  methoden: { label: "Methodenkompetenz", accent: "border-l-orange-500", dot: "bg-orange-500" },
  digital: { label: "Digitale Kompetenz", accent: "border-l-violet-600", dot: "bg-violet-600" },
  selbst: { label: "Selbstkompetenz / Berufliche Orientierung", accent: "border-l-lime-500", dot: "bg-lime-500" },
  kooperativ: { label: "Kooperative Lernformen", accent: "border-l-fuchsia-500", dot: "bg-fuchsia-500" },
  sprache: { label: "Sprachkompetenz", accent: "border-l-emerald-600", dot: "bg-emerald-600" },
};

const STORAGE_KEY = "lele-curriculum-modules-v1";
const MATERIAL_BUCKET = "module-materials";
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const MODULES = [
  m("jg5-001", "Regeln, Verhalten bei Marie", 5, "sozial", "Klassenleitung", ["KL"], "fertig", "Q1", "Jahrgangsteam 5", "Einführung zentraler Regeln, Routinen und Verhaltenserwartungen bei Marie."),
  m("jg5-002", "Klassengemeinschaft, Umgang miteinander", 5, "sozial", "Klassenleitung", ["KL"], "fertig", "Q1", "Jahrgangsteam 5", "Grundlagen für soziales Miteinander und Klassenkultur."),
  m("jg5-003", "Sozialformen: EA / PA, Partnerkontrolle", 5, "kooperativ", "Alle Fachschaften", ["MDE"], "fertig", "Q1", "Jahrgangsteam 5", "Einzelarbeit, Partnerarbeit und Kontrollroutinen verbindlich einführen."),
  m("jg5-004", "Heftführung analog: LeLe-Mappe strukturieren", 5, "methoden", "Alle Fachschaften", ["Bio"], "in Arbeit", "Q1", "Jahrgangsteam 5", "Analoge Heft- und Mappenführung mit Registern und einheitlicher Struktur.", ["Mappencheck"]),
  m("jg5-005", "Lesekompetenz: Leseflüssigkeit und Lesetempo", 5, "lernen", "Sprachen", ["D"], "fertig", "Q2", "Fachschaft Deutsch", "Leseflüssigkeit diagnostizieren, üben und durch Re-Test sichtbar machen.", ["Lesepaten", "Diagnosebogen"]),
  m("jg5-006", "Lernwege – effektiv üben", 5, "lernen", "Alle Fachschaften", ["D", "MDE", "Fö-U"], "fertig", "Q2", "Jahrgangsteam 5", "Lernwege kennenlernen und wirksames Üben mit Rückmeldebögen verbinden.", ["Checker", "Rückmeldebögen"]),
  m("jg5-007", "Arbeit mit Nachschlagewerken", 5, "methoden", "MINT / Sprachen", ["MINT", "D", "E"], "fertig", "Q3", "Fachschaften MINT, Deutsch, Englisch", "Duden, Wörterbücher und Baumbestimmungsbücher sinnvoll nutzen."),
  m("jg5-008", "Internetrecherche", 5, "digital", "Medienbildung", ["Comp"], "in Arbeit", "Q3", "Medienteam", "Einfache Recherche im Internet: Suchbegriffe, Treffer prüfen, Informationen entnehmen."),
  m("jg5-009", "Mobbing / Sozialtraining / gewaltfreie Kommunikation", 5, "sozial", "Soziales Lernen", ["Pol"], "fertig", "Q4", "Jahrgangsteam 5", "Sozialtraining und gewaltfreie Kommunikation als Grundlage für Klassengemeinschaft."),
  m("jg5-010", "Einführung in Teams", 5, "digital", "Medienbildung", ["KL"], "fertig", "Q4", "Medienteam", "Grundlagen der Nutzung von Microsoft Teams in der Einführungswoche.", ["Teams-Anleitung"]),
  m("jg5-011", "Mindmapping I", 5, "lernen", "Sprachen", ["E"], "fertig", "Q4", "Fachschaft Englisch", "Grundlagen des Mindmappings als Lern- und Strukturierungsmethode.", ["Mindmap-Vorlage"]),
  m("jg5-012", "iPads: Ordner anlegen und Speichern in Teams", 5, "digital", "Medienbildung", [], "in Arbeit", "Q4", "Medienteam", "Grundlagen des kollaborativen Arbeitens mit iPads und Teams-Dateistruktur."),

  m("jg6-001", "5-Gang-Lesemethode", 6, "lernen", "Sprachen", ["D"], "fertig", "Q1", "Fachschaft Deutsch", "Texte systematisch erschließen: überfliegen, Fragen stellen, lesen, markieren, zusammenfassen.", ["Methodenblatt"]),
  m("jg6-002", "Reziprokes Lesen", 6, "lernen", "Sprachen", ["D"], "fertig", "Q1", "Fachschaft Deutsch", "Lesestrategie mit Rollen: vorhersagen, klären, fragen, zusammenfassen."),
  m("jg6-003", "Spickzettelmethode", 6, "methoden", "Sprachen", ["Ph"], "fertig", "Q2", "Jahrgangsteam 6", "Inhalte verdichten und für Referate oder Lernphasen strukturiert vorbereiten."),
  m("jg6-004", "Gesunde Ernährung I", 6, "selbst", "Hauswirtschaft / Gesundheit", ["Hauswirtschaft"], "fertig", "Q2", "Fachschaft Hauswirtschaft", "Gesundes Frühstück planen, reflektieren und umsetzen."),
  m("jg6-005", "Mindmapping II / Concept Map", 6, "lernen", "Sprachen", ["E"], "idee", "Q2", "Fachschaft Englisch", "Mindmapping erweitern, visuell gestalten und als Concept Map nutzen."),
  m("jg6-006", "Mündliche Mitarbeit: Kriterien und 3-Stifte-Regel", 6, "selbst", "Alle Fachschaften", ["Ek"], "fertig", "Q3", "Jahrgangsteam 6", "Mündliche Mitarbeit sichtbar machen, Kriterien klären und Selbststeuerung fördern."),
  m("jg6-007", "Selbsteinschätzungsbogen mit Rückmeldung", 6, "selbst", "Alle Fachschaften", [], "idee", "Q3", "offen", "Selbsteinschätzung mit konkreter Rückmeldung verbinden.", ["Selbsteinschätzungsbogen"]),
  m("jg6-008", "Aktives Zuhören", 6, "kooperativ", "Alle Fachschaften", ["E"], "fertig", "Q3", "Jahrgangsteam 6", "Aktiv zuhören, nachfragen und Beiträge anderer aufnehmen."),
  m("jg6-009", "Sozialformen: Gruppenarbeit", 6, "kooperativ", "Religion / Soziales Lernen", ["Reli"], "fertig", "Q4", "Fachschaft Religion", "Gruppenarbeit mit Rollen, Absprachen und Ergebnisverantwortung einführen.", ["Rollenkarten"]),
  m("jg6-010", "Soziale Medien / Cybermobbing", 6, "digital", "Medienbildung", ["KL"], "fertig", "Q4", "Medienscouts / KL", "Umgang mit sozialen Medien, Cybermobbing und Unterstützungsstrukturen."),
  m("jg6-011", "iPads: digitale Heftführung I in GoodNotes", 6, "digital", "Medienbildung", [], "in Arbeit", "Q4", "Medienteam", "Digitale Heftführung in GoodNotes einführen und mit Fachroutinen verbinden."),

  m("jg7-001", "Mappenführung", 7, "methoden", "Alle Fachschaften", [], "fertig", "Q1", "Jahrgangsteam 7", "Mappenführung vertiefen und verbindliche Ordnungskriterien sichern.", ["Mappencheck"]),
  m("jg7-002", "Notizen", 7, "lernen", "Alle Fachschaften", [], "fertig", "Q1", "Jahrgangsteam 7", "Sinnvolle Notizen anlegen, verdichten und für Lernprozesse nutzen."),
  m("jg7-003", "Brainstorming", 7, "lernen", "Alle Fachschaften", [], "fertig", "Q2", "Jahrgangsteam 7", "Ideen sammeln, clustern und für Arbeitsprozesse nutzbar machen."),
  m("jg7-004", "Kollaboratives Arbeiten: Feedback und Rollen", 7, "methoden", "Alle Fachschaften", [], "fertig", "Q2", "Jahrgangsteam 7", "Kooperative Arbeit strukturieren, Rollen klären und Ergebnisse sichern.", ["Rollenkarten", "Feedbackbogen"]),
  m("jg7-005", "Verschiedene Lesetechniken", 7, "lernen", "Sprachen", ["D"], "fertig", "Q3", "Fachschaft Deutsch", "Lesetechniken vergleichen und passend zur Textsorte anwenden."),
  m("jg7-006", "Informationen beschaffen", 7, "methoden", "Alle Fachschaften", [], "fertig", "Q3", "Jahrgangsteam 7", "Informationen zielgerichtet finden, auswählen und sichern."),
  m("jg7-007", "Gesunde Ernährung II", 7, "selbst", "Gesundheit / Hauswirtschaft", ["GEZ"], "fertig", "Q4", "Fachschaft Hauswirtschaft", "Ernährung mit Leistung, Prüfungsvorbereitung und Sport verknüpfen."),

  m("jg8-001", "Visualisierungstechniken I und Präsentationen", 8, "methoden", "Alle Fachschaften", [], "fertig", "Q1", "Jahrgangsteam 8", "Visualisierungstechniken kennenlernen und in Präsentationen anwenden.", ["Bewertungsraster"]),
  m("jg8-002", "Konzentration und strategische Handlungsziele", 8, "selbst", "Alle Fachschaften", [], "fertig", "Q1", "Jahrgangsteam 8", "Konzentration und strategische Zielsetzung mit Blick auf Klassenarbeiten II.", ["Learnattack-Journal"]),
  m("jg8-003", "Feedback geben", 8, "sozial", "Alle Fachschaften", [], "fertig", "Q2", "Jahrgangsteam 8", "Feedback kriteriengeleitet und konstruktiv geben."),
  m("jg8-004", "Visualisierungstechniken II", 8, "digital", "Medienbildung", [], "fertig", "Q2", "Jahrgangsteam 8", "Visualisieren mit digitalen Werkzeugen und erweiterten Präsentationsformen."),
  m("jg8-005", "Rückmeldebögen zur Weiterarbeit nutzen", 8, "selbst", "Alle Fachschaften", [], "fertig", "Q3", "Jahrgangsteam 8", "Rückmeldungen auswerten und konkrete nächste Lernschritte ableiten.", ["Rückmeldebogen"]),
  m("jg8-006", "Medienethik", 8, "digital", "Medienbildung", ["BO"], "fertig", "Q3", "Medienteam", "Medienethische Fragen reflektieren und eigenes Medienhandeln beurteilen."),
  m("jg8-007", "Bewerbungstraining I", 8, "selbst", "Berufliche Orientierung", [], "fertig", "Q3", "BO-Team", "Lebenslauf, Bewerbungsanschreiben und Potenzialanalyse vorbereiten.", ["Lebenslauf", "Anschreiben", "Potenzialanalyse"]),
  m("jg8-008", "Körpersprache", 8, "selbst", "Berufliche Orientierung", [], "fertig", "Q3", "BO-Team", "Körpersprache in Präsentations- und Bewerbungssituationen reflektieren."),

  m("jg9-001", "Selbstreflexion: Lernverhalten", 9, "lernen", "Alle Fachschaften", [], "fertig", "Q1", "Jahrgangsteam 9", "Eigenes Lernverhalten analysieren und Strategien zur Verbesserung ableiten."),
  m("jg9-002", "Richtig zitieren", 9, "methoden", "Sprachen / Gesellschaftslehre", [], "fertig", "Q1", "Fachschaften Deutsch und GL", "Quellen korrekt angeben und Zitate in eigene Texte einbinden.", ["Zitierleitfaden"]),
  m("jg9-003", "Umgang mit ChatGPT und Quellen", 9, "digital", "Medienbildung", [], "in Arbeit", "Q2", "Medienteam", "KI-Ausgaben prüfen, Quellen reflektieren und verantwortungsvoll mit ChatGPT arbeiten.", ["Quellencheck", "KI-Regeln"]),
  m("jg9-004", "Sozialkompetenztraining", 9, "sozial", "Soziales Lernen", [], "fertig", "Q2", "Jahrgangsteam 9", "Umgang miteinander reflektieren und soziale Kompetenzen stärken."),
  m("jg9-005", "Bewerbungstraining II", 9, "selbst", "Berufliche Orientierung", [], "fertig", "Q3", "BO-Team", "Bewerbungstraining vertiefen und auf konkrete Bewerbungssituationen vorbereiten."),
  m("jg9-006", "Höflichkeitstraining", 9, "selbst", "Berufliche Orientierung / Soziales Lernen", [], "fertig", "Q3", "BO-Team", "Höfliches Auftreten in schulischen, beruflichen und sozialen Situationen trainieren."),
];

function m(id, title, year, area, department, subjects, status, quarter, owner, description, materials = []) {
  return {
    id,
    title,
    year,
    area,
    department,
    subjects,
    status,
    quarter,
    owner,
    description,
    digitalPart: area === "digital" ? "ja" : "optional",
    repetition: "Verankerung und Wiederholung werden im Jahrgangs- oder Fachschaftsteam festgelegt.",
    materials,
  };
}

const YEARS = [5, 6, 7, 8, 9, 10];
const STATUSES = { idee: "Idee", "in Arbeit": "In Arbeit", fertig: "Fertig", getestet: "Getestet", lücke: "Lücke" };
const statusStyles = {
  idee: "border-slate-200 bg-slate-50 text-slate-500",
  "in Arbeit": "border-slate-300 bg-white text-slate-700",
  fertig: "border-slate-900 bg-slate-900 text-white",
  getestet: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lücke: "border-red-200 bg-red-50 text-red-700",
};

const getUniqueValues = (items, key) => ["Alle", ...Array.from(new Set(items.map((item) => item[key]))).sort()];

function ModuleCard({ module, onSelect, compact = false }) {
  const area = COMPETENCY_AREAS[module.area];
  return (
    <button
      onClick={() => onSelect(module)}
      className={`w-full rounded-xl border border-slate-200 border-l-4 ${area.accent} bg-white p-3 text-left transition hover:border-slate-400 hover:bg-slate-50`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`${compact ? "text-sm" : "text-base"} font-semibold leading-snug text-slate-950`}>{module.title}</h3>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[module.status]}`}>{STATUSES[module.status]}</span>
      </div>
      {!compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{module.description}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">Jg. {module.year}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{module.quarter}</span>
        {module.subjects.length > 0 && <span className="rounded-full bg-slate-100 px-2 py-1">{module.subjects.join(" · ")}</span>}
      </div>
    </button>
  );
}

export default function LeLeCurriculumTool() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("Alle");
  const [department, setDepartment] = useState("Alle");
  const [areaKey, setAreaKey] = useState("Alle");
  const [modules, setModules] = useState(loadStoredModules);
  const [syncStatus, setSyncStatus] = useState(supabase ? "Verbinde mit Datenbank …" : "Demo-Speicherung im Browser aktiv");
  const [selectedModule, setSelectedModule] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [view, setView] = useState("matrix");

  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      if (!supabase) return;
      const { data, error } = await supabase.from("modules").select("*").order("year", { ascending: true }).order("title", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setSyncStatus("Datenbank nicht erreichbar · Browser-Speicherung aktiv");
        return;
      }

      if (data?.length) {
        const loaded = data.map(fromDbModule);
        setModules(loaded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        setSyncStatus("Mit Supabase synchronisiert");
      } else {
        setSyncStatus("Datenbank verbunden · noch keine Module gespeichert");
      }
    }

    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const departments = useMemo(() => getUniqueValues(modules, "department"), [modules]);

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return modules.filter((module) => {
      const searchText = [module.title, module.description, module.department, module.owner, module.status, module.repetition, module.digitalPart, ...module.subjects, ...module.materials, COMPETENCY_AREAS[module.area].label].join(" ").toLowerCase();
      return (!normalizedQuery || searchText.includes(normalizedQuery)) && (year === "Alle" || module.year === Number(year)) && (department === "Alle" || module.department === department) && (areaKey === "Alle" || module.area === areaKey);
    });
  }, [query, year, department, areaKey, modules]);

  const gaps = useMemo(() => {
    const result = [];
    YEARS.forEach((y) => {
      Object.entries(COMPETENCY_AREAS).forEach(([key, area]) => {
        const hasModule = modules.some((module) => module.year === y && module.area === key && module.status !== "lücke");
        if (!hasModule) result.push({ year: y, area: key, label: area.label });
      });
    });
    return result;
  }, [modules]);

  const saveModule = async (moduleData) => {
    const normalized = {
      ...moduleData,
      year: Number(moduleData.year),
      subjects: splitList(moduleData.subjects),
      materials: splitList(moduleData.materials),
    };

    const nextModules = modules.some((item) => item.id === normalized.id)
      ? modules.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...modules];

    setModules(nextModules);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextModules));
    setEditingModule(null);
    setSelectedModule(normalized);

    if (!supabase) {
      setSyncStatus("Gespeichert im Browser · Supabase noch nicht verbunden");
      return;
    }

    setSyncStatus("Speichere in Supabase …");
    const { error } = await supabase.from("modules").upsert(toDbModule(normalized), { onConflict: "id" });

    if (error) {
      console.error(error);
      setSyncStatus("Browser gespeichert · Supabase-Speicherung fehlgeschlagen");
      return;
    }

    setSyncStatus("Gespeichert und mit Supabase synchronisiert");
  };

  const startGap = (yearValue, areaValue) => {
    setEditingModule(createBlankModule(yearValue, areaValue));
  };

  const startNewModule = () => {
    setEditingModule(createBlankModule(year === "Alle" ? 5 : Number(year), areaKey === "Alle" ? "lernen" : areaKey));
  };

  const plannedByQuarter = useMemo(() => ["Q1", "Q2", "Q3", "Q4"].map((quarter) => ({ quarter, modules: filteredModules.filter((module) => module.quarter === quarter) })), [filteredModules]);

  const resetFilters = () => {
    setQuery("");
    setYear("Alle");
    setDepartment("Alle");
    setAreaKey("Alle");
  };

  return (
    <div className="min-h-screen bg-[#f4f3f0] text-slate-900">
      <header className="border-b border-slate-200 bg-[#f7f6f3]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-slate-300 bg-white px-6 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">LeLe bei Marie</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">Modulübersicht</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">Offizielles Schulwerkzeug für LeLe-Bausteine, Kompetenzbereiche, Fachschaften, Jahresplanung und Curriculum-Lücken.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat value={modules.length} label="Module" dark />
                <Stat value={gaps.length} label="Lücken" />
                <Stat value={departments.length - 1} label="Fachschaften" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(COMPETENCY_AREAS).map(([key, area]) => (
              <button key={key} onClick={() => setAreaKey(areaKey === key ? "Alle" : key)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${areaKey === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}>
                <div className={`h-3 w-3 rounded-full ${area.dot}`} />
                <span className="text-sm font-semibold">{area.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Arbeitsbereich</h2>
              <p className="text-sm text-slate-500">Suchen, filtern, Lücken erkennen oder neue Bausteine anlegen.</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{syncStatus}</p>
            </div>
            <button onClick={startNewModule} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              <Plus className="h-4 w-4" /> Neuer Baustein
            </button>
          </div>
          <div className="grid gap-4 xl:grid-cols-[1fr_140px_220px_220px_auto] xl:items-end">
            <Field label="Suche" icon={<Search className="h-4 w-4" />}>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Baustein, Fach, Material, Kompetenz oder Verantwortliche suchen …" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" />
            </Field>
            <Field label="Jahrgang" icon={<CalendarDays className="h-4 w-4" />}>
              <select value={year} onChange={(event) => setYear(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"><option>Alle</option>{YEARS.map((option) => <option key={option}>{option}</option>)}</select>
            </Field>
            <Field label="Fachschaft" icon={<Users className="h-4 w-4" />}>
              <select value={department} onChange={(event) => setDepartment(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">{departments.map((option) => <option key={option}>{option}</option>)}</select>
            </Field>
            <Field label="Ansicht" icon={<Layers className="h-4 w-4" />}>
              <select value={view} onChange={(event) => setView(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"><option value="matrix">Matrix</option><option value="cards">Karten</option><option value="timeline">Jahresplanung</option><option value="gaps">Kompetenzlücken</option></select>
            </Field>
            <button onClick={resetFilters} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">Zurücksetzen</button>
          </div>
        </section>

        {view === "matrix" && <Matrix filteredModules={filteredModules} setSelectedModule={setSelectedModule} startGap={startGap} />}
        {view === "cards" && <Cards filteredModules={filteredModules} setSelectedModule={setSelectedModule} />}
        {view === "timeline" && <Timeline plannedByQuarter={plannedByQuarter} setSelectedModule={setSelectedModule} />}
        {view === "gaps" && <Gaps gaps={gaps} setAreaKey={setAreaKey} startGap={startGap} />}
      </main>

      {selectedModule && <Detail module={selectedModule} onClose={() => setSelectedModule(null)} onEdit={() => setEditingModule(selectedModule)} onModuleRefresh={(updatedModule) => {
        setSelectedModule(updatedModule);
        setModules((current) => {
          const next = current.map((item) => (item.id === updatedModule.id ? updatedModule : item));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }} />}
      {editingModule && <ModuleForm module={editingModule} onClose={() => setEditingModule(null)} onSave={saveModule} />}
    </div>
  );
}

function Stat({ value, label, dark = false }) {
  return <div className={`rounded-xl border px-4 py-3 ${dark ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}><p className="text-2xl font-semibold">{value}</p><p className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>{label}</p></div>;
}

function Field({ label, icon, children }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">{icon} {label}</span>{children}</label>;
}

function Matrix({ filteredModules, setSelectedModule, startGap }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="grid grid-cols-[190px_repeat(6,minmax(150px,1fr))] border-b border-slate-300 bg-[#efeee9] text-sm font-semibold uppercase tracking-wide text-slate-700">
        <div className="p-3">Kompetenz</div>
        {YEARS.map((y) => <div key={y} className="border-l border-slate-300 p-3">Jahrgang {y}</div>)}
      </div>
      {Object.entries(COMPETENCY_AREAS).map(([key, area]) => (
        <div key={key} className="grid grid-cols-[190px_repeat(6,minmax(150px,1fr))] border-b border-slate-200 last:border-b-0">
          <div className={`border-l-4 ${area.accent} bg-slate-50 p-3 text-sm font-semibold leading-snug text-slate-700`}>{area.label}</div>
          {YEARS.map((y) => {
            const modules = filteredModules.filter((module) => module.year === y && module.area === key);
            return <div key={`${key}-${y}`} className="min-h-36 border-l border-slate-200 bg-white p-2">{modules.length > 0 ? <div className="grid gap-2">{modules.map((module) => <ModuleCard key={module.id} module={module} onSelect={setSelectedModule} compact />)}</div> : <EmptyGap year={y} areaKey={key} startGap={startGap} />}</div>;
          })}
        </div>
      ))}
    </section>
  );
}

function EmptyGap({ year, areaKey, startGap }) {
  return <button onClick={() => startGap(year, areaKey)} className="flex h-full min-h-24 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs font-semibold text-slate-400 transition hover:border-slate-500 hover:text-slate-700">+ Lücke anlegen</button>;
}

function Cards({ filteredModules, setSelectedModule }) {
  return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredModules.map((module, index) => <motion.div key={module.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.015 }}><ModuleCard module={module} onSelect={setSelectedModule} /></motion.div>)}</section>;
}

function Timeline({ plannedByQuarter, setSelectedModule }) {
  return <section className="grid gap-5 lg:grid-cols-4">{plannedByQuarter.map((group) => <div key={group.quarter} className="rounded-2xl border border-slate-200 bg-white p-4"><h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Clock3 className="h-5 w-5" /> {group.quarter}</h2><div className="grid gap-3">{group.modules.map((module) => <ModuleCard key={module.id} module={module} onSelect={setSelectedModule} compact />)}{group.modules.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Keine Module in dieser Auswahl.</p>}</div></div>)}</section>;
}

function Gaps({ gaps, setAreaKey, startGap }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-slate-100 p-3 text-slate-700"><AlertTriangle className="h-6 w-6" /></div><div><h2 className="text-2xl font-semibold">Automatisch erkannte Kompetenzlücken</h2><p className="text-sm text-slate-600">Eine Lücke entsteht, wenn ein Jahrgang in einem Kompetenzbereich noch keinen aktiven Baustein hat.</p></div></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{gaps.map((gap) => { const area = COMPETENCY_AREAS[gap.area]; return <div key={`${gap.year}-${gap.area}`} className={`rounded-xl border border-slate-200 border-l-4 ${area.accent} bg-white p-4`}><button onClick={() => setAreaKey(gap.area)} className="block w-full text-left"><p className="text-sm font-semibold text-slate-500">Jahrgang {gap.year}</p><h3 className="mt-1 font-semibold text-slate-950">{gap.label}</h3><p className="mt-2 text-sm text-slate-600">Noch kein Baustein hinterlegt.</p></button><button onClick={() => startGap(gap.year, gap.area)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Plus className="h-4 w-4" /> Baustein aus Lücke erstellen</button></div>; })}</div></section>;
}

function Detail({ module, onClose, onEdit, onModuleRefresh }) {
  const area = COMPETENCY_AREAS[module.area];
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.98, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Jahrgang {module.year} · {module.quarter}</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">{module.title}</h2></div><div className="flex gap-2"><button onClick={onEdit} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" aria-label="Bearbeiten"><Pencil className="h-5 w-5" /></button><button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" aria-label="Schließen"><X className="h-5 w-5" /></button></div></div>
        <div className={`mb-5 rounded-xl border border-slate-200 border-l-4 ${area.accent} bg-slate-50 px-4 py-3 font-semibold text-slate-800`}>{area.label}</div>
        <p className="text-base leading-7 text-slate-700">{module.description}</p>
        <dl className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3"><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fachschaft</dt><dd className="mt-1 font-semibold">{module.department}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verantwortlich</dt><dd className="mt-1 font-semibold">{module.owner}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt><dd className={`mt-1 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[module.status]}`}>{STATUSES[module.status]}</dd></div></dl>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><h3 className="mb-2 flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> Wiederholung & Verankerung</h3><p className="text-sm leading-6 text-slate-600">{module.repetition}</p></div><div className="rounded-xl border border-slate-200 p-4"><h3 className="mb-2 font-semibold">Materialien</h3>{module.materials.length > 0 ? <div className="flex flex-wrap gap-2">{module.materials.map((material) => <span key={material} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{material}</span>)}</div> : <p className="text-sm text-slate-500">Noch kein Material hinterlegt.</p>}</div></div>
        <div className="mt-5 rounded-xl border border-slate-200 p-4"><h3 className="mb-2 font-semibold">Fächer & digitaler Anteil</h3><p className="text-sm leading-6 text-slate-600">Fächer: <strong>{module.subjects.length ? module.subjects.join(" · ") : "offen"}</strong></p><p className="text-sm leading-6 text-slate-600">Digitaler Anteil: <strong>{module.digitalPart}</strong></p></div>
        <MaterialUpload module={module} onModuleRefresh={onModuleRefresh} />
      </motion.div>
    </div>
  );
}

function MaterialUpload({ module, onModuleRefresh }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const attachments = module.attachments || [];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      setUploadStatus("Upload braucht Supabase. Prüfe URL und Key in Netlify.");
      return;
    }

    setUploadStatus("Datei wird hochgeladen …");

    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${module.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(MATERIAL_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error(uploadError);
      setUploadStatus(`Upload fehlgeschlagen: ${uploadError.message}`);
      return;
    }

    const { data } = supabase.storage.from(MATERIAL_BUCKET).getPublicUrl(path);
    const nextAttachment = {
      name: file.name,
      path,
      url: data.publicUrl,
      size: file.size,
      type: file.type || "Datei",
      uploadedAt: new Date().toISOString(),
    };

    const updatedModule = {
      ...module,
      attachments: [...attachments, nextAttachment],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadStoredModules().map((item) => (item.id === updatedModule.id ? updatedModule : item))));

    const { error: dbError } = await supabase.from("modules").upsert(toDbModule(updatedModule), { onConflict: "id" });
    if (dbError) {
      console.error(dbError);
      setUploadStatus("Datei hochgeladen, aber Verknüpfung konnte nicht gespeichert werden.");
      return;
    }

    onModuleRefresh(updatedModule);
    setUploadStatus("Datei gespeichert ✓");
    event.target.value = "";
  };

  const removeAttachment = async (attachment) => {
    const updatedModule = {
      ...module,
      attachments: attachments.filter((item) => item.path !== attachment.path),
    };

    if (supabase) {
      await supabase.storage.from(MATERIAL_BUCKET).remove([attachment.path]);
      await supabase.from("modules").upsert(toDbModule(updatedModule), { onConflict: "id" });
    }

    onModuleRefresh(updatedModule);
    setUploadStatus("Datei entfernt.");
  };

  return (
    <div className="mt-5 rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-5 w-5" /> Arbeitsblätter & Materialien</h3>
          <p className="mt-1 text-sm text-slate-500">PDFs, Arbeitsblätter, Präsentationen oder Vorlagen an diesen Baustein anhängen.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          <Upload className="h-4 w-4" /> Datei hochladen
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {uploadStatus && <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{uploadStatus}</p>}

      {attachments.length > 0 ? (
        <div className="grid gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.path} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <a href={attachment.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 hover:underline">
                {attachment.name}
              </a>
              <button onClick={() => removeAttachment(attachment)} className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-600" aria-label="Datei entfernen">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Noch keine Dateien hochgeladen.</p>
      )}
    </div>
  );
}

function loadStoredModules() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MODULES;
  } catch {
    return MODULES;
  }
}

function toDbModule(module) {
  return {
    id: module.id,
    title: module.title,
    year: module.year,
    area: module.area,
    department: module.department,
    subjects: module.subjects,
    status: module.status,
    quarter: module.quarter,
    owner: module.owner,
    description: module.description,
    digital_part: module.digitalPart,
    repetition: module.repetition,
    materials: module.materials,
    attachments: module.attachments || [],
    updated_at: new Date().toISOString(),
  };
}

function fromDbModule(row) {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    area: row.area,
    department: row.department,
    subjects: row.subjects || [],
    status: row.status,
    quarter: row.quarter,
    owner: row.owner,
    description: row.description,
    digitalPart: row.digital_part || "optional",
    repetition: row.repetition || "",
    materials: row.materials || [],
    attachments: row.attachments || [],
  };
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function createBlankModule(year, area) {
  return {
    id: `neu-${Date.now()}`,
    title: "",
    year,
    area,
    department: "offen",
    subjects: [],
    status: "idee",
    quarter: "Q1",
    owner: "offen",
    description: "",
    digitalPart: area === "digital" ? "ja" : "optional",
    repetition: "",
    materials: [],
    attachments: [],
  };
}

function ModuleForm({ module, onClose, onSave }) {
  const [form, setForm] = useState({
    ...module,
    subjects: Array.isArray(module.subjects) ? module.subjects.join(", ") : module.subjects,
    materials: Array.isArray(module.materials) ? module.materials.join(", ") : module.materials,
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <motion.form initial={{ opacity: 0, scale: 0.98, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Baustein bearbeiten</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">{form.title || "Neue Kompetenzlücke füllen"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" aria-label="Schließen"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput label="Titel" value={form.title} onChange={(value) => update("title", value)} required />
          <FormSelect label="Status" value={form.status} onChange={(value) => update("status", value)} options={Object.keys(STATUSES)} labels={STATUSES} />
          <FormSelect label="Jahrgang" value={String(form.year)} onChange={(value) => update("year", Number(value))} options={YEARS.map(String)} />
          <FormSelect label="Zeitplanung" value={form.quarter} onChange={(value) => update("quarter", value)} options={["Q1", "Q2", "Q3", "Q4", "offen"]} />
          <FormSelect label="Kompetenzbereich" value={form.area} onChange={(value) => update("area", value)} options={Object.keys(COMPETENCY_AREAS)} labels={Object.fromEntries(Object.entries(COMPETENCY_AREAS).map(([key, area]) => [key, area.label]))} />
          <FormInput label="Fachschaft / Bereich" value={form.department} onChange={(value) => update("department", value)} />
          <FormInput label="Fächer (kommagetrennt)" value={form.subjects} onChange={(value) => update("subjects", value)} placeholder="z. B. D, GL, KL" />
          <FormInput label="Verantwortlich" value={form.owner} onChange={(value) => update("owner", value)} />
          <FormSelect label="Digitaler Anteil" value={form.digitalPart} onChange={(value) => update("digitalPart", value)} options={["nein", "optional", "teilweise", "ja", "offen"]} />
          <FormInput label="Materialien (kommagetrennt)" value={form.materials} onChange={(value) => update("materials", value)} placeholder="z. B. Checkliste, Vorlage, Link" />
        </div>

        <div className="mt-4 grid gap-4">
          <FormTextarea label="Beschreibung / Kompetenzziel" value={form.description} onChange={(value) => update("description", value)} placeholder="Was können die Schülerinnen und Schüler danach konkret?" />
          <FormTextarea label="Wiederholung & Verankerung" value={form.repetition} onChange={(value) => update("repetition", value)} placeholder="Welche Fächer greifen den Baustein wann wieder auf?" />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Abbrechen</button>
          <button type="submit" className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700">Speichern</button>
        </div>
      </motion.form>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder = "", required = false }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" /></label>;
}

function FormSelect({ label, value, onChange, options, labels = {} }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white">{options.map((option) => <option key={option} value={option}>{labels[option] || option}</option>)}</select></label>;
}

function FormTextarea({ label, value, onChange, placeholder = "" }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" /></label>;
}
