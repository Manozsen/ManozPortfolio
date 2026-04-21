"use client";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function ProjectFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onChange("All")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px] ${active === "All" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>
        All
      </button>
      {categories.map((cat) => (
        <button key={cat} onClick={() => onChange(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px] ${active === cat ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
