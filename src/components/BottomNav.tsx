export type Tab = "path" | "games" | "poke" | "color";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "path", label: "Stien", emoji: "🗺️" },
  { id: "games", label: "Tællere", emoji: "🎮" },
  { id: "poke", label: "PokeBror", emoji: "🫵" },
  { id: "color", label: "Farvelæg", emoji: "🎨" },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-btn ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-emoji">{tab.emoji}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
