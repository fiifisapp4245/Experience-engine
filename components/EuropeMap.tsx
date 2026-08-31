// Hand-drawn, deliberately simplified Europe silhouette (not a traced
// geographic dataset) — Germany highlighted as the centerpiece, with Italy
// as its own peninsula so Milan's marker still reads in real geographic
// context. Coordinates are in the same 0–100 space investmentAreas' x/y
// percentages use, so markers line up with the landmass without any extra
// projection math.

type Point = [number, number];

// Rounds a closed polygon into a soft blob: each original point becomes a
// curve control point, with the path only actually touching the midpoints
// between consecutive vertices — the standard "smooth polygon" trick.
function smoothPath(points: Point[]): string {
  const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[points.length - 1], points[0]);
  let d = `M${start[0]},${start[1]} `;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    const m = mid(points[i], next);
    d += `Q${points[i][0]},${points[i][1]} ${m[0]},${m[1]} `;
  }
  return d + "Z";
}

const EUROPE_POINTS: Point[] = [
  [16, 88],
  [13, 68],
  [17, 50],
  [14, 36],
  [20, 24],
  [30, 14],
  [44, 10],
  [48, 4],
  [56, 10],
  [52, 20],
  [58, 6],
  [70, 4],
  [78, 18],
  [68, 26],
  [76, 22],
  [86, 34],
  [88, 52],
  [80, 64],
  [84, 72],
  [72, 82],
  [64, 74],
  [58, 62],
  [50, 56],
  [42, 64],
  [36, 78],
  [26, 88],
];

const GERMANY_POINTS: Point[] = [
  [43, 20],
  [50, 18],
  [56, 24],
  [58, 35],
  [56, 44],
  [52, 54],
  [46, 55],
  [41, 48],
  [39, 36],
  [40, 26],
];

const ITALY_POINTS: Point[] = [
  [48, 58],
  [56, 56],
  [62, 64],
  [66, 76],
  [60, 82],
  [56, 90],
  [50, 86],
  [46, 74],
  [44, 64],
];

const EUROPE_PATH = smoothPath(EUROPE_POINTS);
const GERMANY_PATH = smoothPath(GERMANY_POINTS);
const ITALY_PATH = smoothPath(ITALY_POINTS);

export function EuropeMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={EUROPE_PATH} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} strokeLinejoin="round" />
      <path d={ITALY_PATH} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.5} strokeLinejoin="round" />
      <path
        d={GERMANY_PATH}
        fill="rgba(226,0,116,0.14)"
        stroke="var(--brand)"
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
      <text
        x={49.5}
        y={38}
        textAnchor="middle"
        className="fill-brand"
        style={{ fontSize: 3.4, fontWeight: 600, letterSpacing: "0.06em" }}
      >
        GERMANY
      </text>
      <text
        x={55}
        y={85}
        textAnchor="middle"
        style={{ fontSize: 2.6, fontWeight: 500, letterSpacing: "0.05em", fill: "var(--muted-foreground)" }}
      >
        ITALY
      </text>
    </svg>
  );
}
