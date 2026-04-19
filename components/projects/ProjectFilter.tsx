"use client";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function ProjectFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onChange("All")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          active === "All"
            ? "bg-violet-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
