'use client'

// South Indian Kundali chart — 4×4 grid, signs FIXED at specific positions
// Outer ring = 12 sign-cells (clockwise from top-left: Pi Ar Ta Ge Ca Le Vi Li Sc Sg Cp Aq)
// Inner 2×2 = decorative center
// Planets placed by their SIGN, house number derived from ascendant offset

const PLANET_ABBR: Record<string, string> = {
  Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me',
  Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke',
}

const SIGN_IDX: Record<string, number> = {
  Aries:0, Taurus:1, Gemini:2, Cancer:3, Leo:4, Virgo:5,
  Libra:6, Scorpio:7, Sagittarius:8, Capricorn:9, Aquarius:10, Pisces:11,
}

const SIGN_ABBR: Record<string, string> = {
  Aries:'Ari', Taurus:'Tau', Gemini:'Gem', Cancer:'Can', Leo:'Leo', Virgo:'Vir',
  Libra:'Lib', Scorpio:'Sco', Sagittarius:'Sag', Capricorn:'Cap', Aquarius:'Aqu', Pisces:'Pis',
}

// Fixed grid positions for each sign (col 0-3, row 0-3)
const GRID: { sign: string; col: number; row: number }[] = [
  { sign:'Pisces',       col:0, row:0 },
  { sign:'Aries',        col:1, row:0 },
  { sign:'Taurus',       col:2, row:0 },
  { sign:'Gemini',       col:3, row:0 },
  { sign:'Cancer',       col:3, row:1 },
  { sign:'Leo',          col:3, row:2 },
  { sign:'Virgo',        col:3, row:3 },
  { sign:'Libra',        col:2, row:3 },
  { sign:'Scorpio',      col:1, row:3 },
  { sign:'Sagittarius',  col:0, row:3 },
  { sign:'Capricorn',    col:0, row:2 },
  { sign:'Aquarius',     col:0, row:1 },
]

function houseNum(sign: string, asc: string): number {
  return ((SIGN_IDX[sign] - (SIGN_IDX[asc] ?? 0) + 12) % 12) + 1
}

function dms(deg: number): string {
  const d = Math.floor(deg)
  const m = Math.floor((deg - d) * 60)
  return `${d}°${String(m).padStart(2,'0')}'`
}

interface Planet { name:string; sign?:string; house?:number; degree_in_sign?:number; is_retrograde?:boolean }
interface HouseData { house:number; sign:string }

interface KundaliGridProps {
  planets: Planet[]
  houses: HouseData[]
  ascendantSign: string
  className?: string
}

export default function KundaliGrid({ planets, ascendantSign, className }: KundaliGridProps) {
  // Group planets by their sign
  const bySign: Record<string, Planet[]> = {}
  planets.forEach(p => {
    const s = p.sign
    if (s) { bySign[s] = [...(bySign[s] ?? []), p] }
  })

  return (
    <div
      className={`grid border border-gold/50 ${className ?? 'w-full'}`}
      style={{ gridTemplateColumns:'repeat(4,1fr)', gridTemplateRows:'repeat(4,1fr)', aspectRatio:'1' }}
    >
      {/* 12 outer sign cells */}
      {GRID.map(({ sign, col, row }) => {
        const h = houseNum(sign, ascendantSign)
        const isLagna = sign === ascendantSign
        const cell = bySign[sign] ?? []

        return (
          <div
            key={sign}
            style={{ gridColumn: col + 1, gridRow: row + 1 }}
            className={`flex flex-col p-1 border overflow-hidden
              ${isLagna
                ? 'border-amber/70 bg-amber/5'
                : 'border-gold/30 bg-transparent'}`}
          >
            {/* House number + Lagna marker */}
            <div className="flex justify-between items-start leading-none mb-0.5">
              <span className="text-[8px] font-bold text-indigo-400">{isLagna ? 'Lg' : ' '}</span>
              <span className="text-[8px] text-gold/55 font-mono">{h}</span>
            </div>

            {/* Sign name */}
            <p className="text-[9px] italic text-cosmic/75 text-center leading-none mb-1">
              {SIGN_ABBR[sign] ?? sign.slice(0,3)}
            </p>

            {/* Planets */}
            <div className="flex flex-col items-center gap-0.5 flex-1 justify-center">
              {cell.map(p => (
                <div key={p.name} className="text-center leading-none">
                  <span className={`text-[12px] font-bold leading-none ${p.is_retrograde ? 'text-indigo-400' : 'text-amber'}`}>
                    {PLANET_ABBR[p.name] ?? p.name.slice(0,2)}{p.is_retrograde ? '℞' : ''}
                  </span>
                  {p.degree_in_sign !== undefined && (
                    <p className="text-[7px] text-cosmic/65 leading-none">{dms(p.degree_in_sign)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Center 2×2 decorative block */}
      <div
        style={{ gridColumn:'2/4', gridRow:'2/4' }}
        className="border border-gold/15 flex flex-col items-center justify-center gap-1"
      >
        <span className="text-gold/25 font-serif text-sm tracking-widest">D1</span>
        <span className="text-gold/15 text-[8px] tracking-[3px]">कुंडली</span>
      </div>
    </div>
  )
}
