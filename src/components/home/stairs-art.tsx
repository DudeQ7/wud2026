// Ilustracja schodów (docs/schody/schody_design.md §4): jedna spirala, 3 piętra, widok z przodu.
// Czysta geometria SVG w układzie 360 × ART_HEIGHT – plakaty i hint pozycjonuje stairs.tsx we
// współrzędnych z tego samego modułu (axisY, slotCenterY), więc ilustracja i plakaty się nie rozjeżdżają.

export const ART_WIDTH = 360
export const ART_HEIGHT = 1010
export const FLOORS = 3
export const PITCH = 300
export const STRIP_HALF = 95
const FIRST_AXIS = 185
const LEFT = 30
const RIGHT = 330

/** Widoczny wycinek ilustracji: same schody, bez pustych pasów po bokach – rysunek wypełnia całą szerokość */
export const VIEW_X = LEFT
export const VIEW_W = RIGHT - LEFT

/** Pozycja x z układu ilustracji jako % szerokości widocznego wycinka */
export const xPercent = (x: number) => ((x - VIEW_X) / VIEW_W) * 100

/** Środek pasa piętra na osi pionowej */
export const axisY = (floor: number) => FIRST_AXIS + floor * PITCH

/** Przesunięcie pionowe pasa względem osi w danym x: pas opada w prawo */
const OFFSETS: [number, number][] = [
  [LEFT, -38],
  [80, -18],
  [180, 22],
  [280, 51],
  [RIGHT, 62],
]

function offsetAt(x: number) {
  for (let i = 1; i < OFFSETS.length; i++) {
    const [x1, y1] = OFFSETS[i]
    const [x0, y0] = OFFSETS[i - 1]
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return OFFSETS.at(-1)![1]
}

/** Środek plakatu w slocie (0 lewy, 1 środek, 2 prawy) względem osi piętra */
export const SLOTS = [
  { cx: 80, dy: -18 },
  { cx: 180, dy: 22 },
  { cx: 280, dy: 51 },
] as const

export const slotCenterY = (floor: number, slot: number) => axisY(floor) + SLOTS[slot].dy

const topEdge = (floor: number, x: number) => axisY(floor) - STRIP_HALF + offsetAt(x)
const bottomEdge = (floor: number, x: number) => axisY(floor) + STRIP_HALF + offsetAt(x)

const XS = OFFSETS.map(([x]) => x)
const points = (list: [number, number][]) => list.map(([x, y]) => `${x},${y}`).join(" ")

function stripPolygon(floor: number, extra = 0) {
  const top = XS.map((x): [number, number] => [x, topEdge(floor, x)])
  const bottom = [...XS].reverse().map((x): [number, number] => [x, bottomEdge(floor, x) + extra])
  return points([...top, ...bottom])
}

/** Przestrzeń między pasem piętra i kolejnego – tu widać spody drugiej połowy zwoju */
function gapPolygon(floor: number) {
  const top = XS.map((x): [number, number] => [x, bottomEdge(floor, x) + 12])
  const bottom = [...XS].reverse().map((x): [number, number] => [x, topEdge(floor + 1, x)])
  return points([...top, ...bottom])
}

/** `shadowId` – osobny id filtra, gdy ilustracja stoi na stronie drugi raz (kafel „Budynek”) */
export function StairsArt({ shadowId = "stairs-shadow" }: { shadowId?: string } = {}) {
  const floors = Array.from({ length: FLOORS }, (_, i) => i)
  const seams = Array.from({ length: 5 }, (_, i) => LEFT + ((RIGHT - LEFT) * (i + 1)) / 6)
  const wallSeams = Array.from({ length: 4 }, (_, i) => LEFT + 60 * (i + 1))
  const posts = Array.from({ length: 13 }, (_, i) => LEFT + 6 + i * ((RIGHT - LEFT - 12) / 12))

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`${VIEW_X} 0 ${VIEW_W} ${ART_HEIGHT}`}
      // Rozciągane tylko w poziomie: kreski zostają cienkie dzięki non-scaling-stroke
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <defs>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="13" floodColor="#1A1A1A" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* 1. Tło klatki z pionowymi szwami (panele ściany atrium) */}
      <rect x={LEFT} y={0} width={RIGHT - LEFT} height={ART_HEIGHT - 20} fill="#F7F6F2" />
      {wallSeams.map((x) => (
        <line vectorEffect="non-scaling-stroke" key={x} x1={x} x2={x} y1={0} y2={ART_HEIGHT - 20} stroke="#EDEBE5" strokeWidth={1} />
      ))}

      {/* 2. Spody: druga połowa zwoju widoczna w szczelinach między piętrami */}
      {floors.slice(0, -1).map((floor) => (
        <g key={`gap-${floor}`}>
          <polygon vectorEffect="non-scaling-stroke" points={gapPolygon(floor)} fill="#EDEBE5" />
          {Array.from({ length: 11 }, (_, i) => {
            const x = LEFT + ((RIGHT - LEFT) * (i + 1)) / 12
            return (
              <line vectorEffect="non-scaling-stroke"
                key={i}
                x1={x}
                x2={x}
                y1={bottomEdge(floor, x) + 12}
                y2={topEdge(floor + 1, x)}
                stroke="#DEDAD2"
                strokeWidth={1}
              />
            )
          })}
        </g>
      ))}

      {/* 3–6. Pasy frontowe: grubość płyty, pas z cieniem, szwy, nosing, balustrada */}
      {floors.map((floor) => (
        <g key={floor}>
          <polygon vectorEffect="non-scaling-stroke" points={stripPolygon(floor, 12)} fill="#DEDAD2" />
          <g filter={`url(#${shadowId})`}>
            <polygon vectorEffect="non-scaling-stroke" points={stripPolygon(floor)} fill="#FFFFFF" stroke="#DEDAD2" strokeWidth={1} />
          </g>
          {seams.map((x) => (
            <line vectorEffect="non-scaling-stroke"
              key={x}
              x1={x}
              x2={x}
              y1={topEdge(floor, x)}
              y2={bottomEdge(floor, x)}
              stroke="#EDEBE5"
              strokeWidth={1}
            />
          ))}
          <polyline vectorEffect="non-scaling-stroke"
            points={points(XS.map((x): [number, number] => [x, bottomEdge(floor, x) - 6]))}
            fill="none"
            stroke="#EDEBE5"
            strokeWidth={2}
          />
          {posts.map((x, i) => (
            <line vectorEffect="non-scaling-stroke"
              key={x}
              x1={x}
              x2={x}
              y1={topEdge(floor, x) - 20}
              y2={topEdge(floor, x)}
              stroke="#8A6D2F"
              strokeWidth={i % 4 === 0 ? 2.5 : 1}
            />
          ))}
          <polyline vectorEffect="non-scaling-stroke"
            points={points(XS.map((x): [number, number] => [x, topEdge(floor, x) - 20]))}
            fill="none"
            stroke="#8A6D2F"
            strokeWidth={1.5}
          />
        </g>
      ))}
    </svg>
  )
}
