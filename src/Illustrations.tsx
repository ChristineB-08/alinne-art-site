/* Hand-drawn style line illustrations for the "how a piece is born" steps.
   Elements with class "draw" are stroked in on scroll (pathLength=1),
   elements with class "pop" scale in afterwards. */

const common = {
  viewBox: '0 0 160 160',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true
};

export function IdeaArt() {
  return (
    <svg {...common} className="illo">
      <circle className="pop blob" cx="80" cy="82" r="62" />
      <path className="draw" pathLength={1} d="M30 36h100a14 14 0 0 1 14 14v48a14 14 0 0 1-14 14H74l-24 22v-22H30a14 14 0 0 1-14-14V50a14 14 0 0 1 14-14z" />
      <path className="pop accent" d="M80 98C60 85 56 66 69 63c6-1 10 3 11 8 1-5 5-9 11-8 13 3 9 22-11 35z" />
      <path className="draw" pathLength={1} d="M38 52h18M38 60h10" />
      <path className="pop accent" d="M140 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
      <path className="pop accent-2" d="M20 128l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
    </svg>
  );
}

export function OutlineArt() {
  return (
    <svg {...common} className="illo">
      <circle className="pop blob" cx="80" cy="82" r="62" />
      <rect className="pop glass" x="34" y="26" width="84" height="108" rx="4" />
      <rect className="draw" pathLength={1} x="28" y="20" width="96" height="120" rx="7" />
      <path className="draw thin" pathLength={1} d="M42 46l14-12M42 58l26-22" />
      <path className="draw thick" pathLength={1} d="M48 84q26-26 54-8" />
      <path className="draw" pathLength={1} d="M54 92q24 12 44-6" />
      <circle className="draw" pathLength={1} cx="76" cy="84" r="10" />
      <circle className="pop accent" cx="76" cy="84" r="5" />
      <path className="draw" pathLength={1} d="M102 76l9-6M98 70l6-9" />
      <path className="draw" pathLength={1} d="M152 150l-34-40" strokeWidth={6} />
      <path className="draw" pathLength={1} d="M118 110l-6-8" strokeWidth={10} />
      <path className="pop accent" d="M112 102c-4-6-10-8-12-6 2 6 6 8 12 6z" />
    </svg>
  );
}

export function ColourArt() {
  return (
    <svg {...common} className="illo">
      <circle className="pop blob" cx="80" cy="82" r="62" />
      <path className="draw" pathLength={1} d="M78 26C36 26 14 60 20 92c6 32 40 46 70 40 14-3 12-16 4-22-8-6-4-18 8-18h16c16 0 24-12 22-26-6-24-30-40-62-40z" />
      <circle className="pop" style={{ fill: '#eb5b00' }} cx="50" cy="58" r="8" stroke="none" />
      <circle className="pop" style={{ fill: '#7b5cff' }} cx="78" cy="44" r="8" stroke="none" />
      <circle className="pop" style={{ fill: '#21a99a' }} cx="108" cy="52" r="8" stroke="none" />
      <circle className="pop" style={{ fill: '#f2c230' }} cx="42" cy="90" r="8" stroke="none" />
      <circle className="pop" style={{ fill: '#e2453c' }} cx="62" cy="114" r="8" stroke="none" />
      <path className="draw" pathLength={1} d="M152 22l-38 46" strokeWidth={6} />
      <path className="draw" pathLength={1} d="M114 68l-6 7" strokeWidth={10} />
      <path className="pop accent-2" d="M106 78c-6 2-8 10-4 14 6-2 8-8 4-14z" />
      <path className="pop accent" d="M140 104c0 6-8 6-8 0s4-10 4-10 4 4 4 10z" />
    </svg>
  );
}

export function DeliveryArt() {
  return (
    <svg {...common} className="illo">
      <circle className="pop blob" cx="80" cy="82" r="62" />
      <rect className="draw" pathLength={1} x="34" y="74" width="92" height="64" rx="5" />
      <rect className="draw" pathLength={1} x="28" y="58" width="104" height="18" rx="5" />
      <path className="draw" pathLength={1} d="M80 58v80" />
      <path className="pop accent" d="M80 58c-14-22-34-14-20-2zM80 58c14-22 34-14 20-2z" />
      <path className="pop accent" d="M71 102c-9-6-10-15-4-16 3 0 5 2 5 4 0-2 2-4 5-4 6 1 5 10-4 16z" transform="translate(30 0)" />
      <path className="draw thin" pathLength={1} d="M14 96h12M10 110h14M18 124h8" />
      <path className="pop accent-2" d="M138 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      <path className="pop accent" d="M24 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
    </svg>
  );
}

export const processArt = [IdeaArt, OutlineArt, ColourArt, DeliveryArt];

/* decorative brush squiggle */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg className={`squiggle ${className}`} viewBox="0 0 300 40" fill="none" aria-hidden="true">
      <path className="draw" pathLength={1} d="M4 26C40 6 64 34 98 20s56-16 86 2 64 10 112-12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
