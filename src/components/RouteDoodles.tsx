// Små, simple SVG-tegninger der pynter kortet ved bestemte stop.
// Hver tegning er centreret om (0,0) og skal placeres via en ydre <g transform="translate(x,y)">.

export function MedievalTown() {
  return (
    <g className="doodle doodle-town">
      <rect x="-26" y="-6" width="16" height="20" rx="1" className="doodle-house house-a" />
      <polygon points="-27,-6 -18,-16 -9,-6" className="doodle-roof roof-a" />
      <rect x="-8" y="-12" width="14" height="26" rx="1" className="doodle-house house-b" />
      <polygon points="-9,-12 -1,-22 7,-12" className="doodle-roof roof-b" />
      <rect x="8" y="-2" width="15" height="16" rx="1" className="doodle-house house-c" />
      <polygon points="7,-2 15.5,-11 23,-2" className="doodle-roof roof-c" />
      {/* lille kirketårn */}
      <rect x="-3" y="-30" width="6" height="10" className="doodle-tower" />
      <polygon points="-4,-30 0,-38 4,-30" className="doodle-tower-roof" />
      <circle cx="0" cy="-40" r="1.6" className="doodle-tower-tip" />
    </g>
  );
}

export function HotelZzz() {
  return (
    <g className="doodle doodle-hotel">
      <rect x="-16" y="-8" width="32" height="24" rx="2" className="doodle-hotel-body" />
      <polygon points="-19,-8 0,-22 19,-8" className="doodle-hotel-roof" />
      <rect x="-5" y="4" width="10" height="12" className="doodle-hotel-door" />
      <rect x="-11" y="-2" width="6" height="6" className="doodle-hotel-window" />
      <rect x="5" y="-2" width="6" height="6" className="doodle-hotel-window" />
      <text x="16" y="-20" fontSize="13" className="doodle-zzz">
        Zzz
      </text>
    </g>
  );
}

export function SnowMountain() {
  return (
    <g className="doodle doodle-mountain">
      <polygon points="-30,14 -6,-26 18,14" className="doodle-mountain-back" />
      <polygon points="-6,-26 -14,-6 2,-6" className="doodle-snowcap-back" />
      <polygon points="-10,16 14,-32 38,16" className="doodle-mountain-front" />
      <polygon points="14,-32 3,-10 25,-10" className="doodle-snowcap-front" />
    </g>
  );
}

export function Lake() {
  return (
    <g className="doodle doodle-lake">
      <ellipse cx="0" cy="0" rx="30" ry="16" className="doodle-lake-water" />
      <path d="M -18 -2 Q -12 -6 -6 -2 T 6 -2 T 18 -2" className="doodle-lake-wave" />
      <path d="M -16 6 Q -10 2 -4 6 T 8 6 T 20 6" className="doodle-lake-wave" />
    </g>
  );
}
