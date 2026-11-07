import { useEffect, useRef, useState } from 'react'
import { useCount } from '../hooks.js'
import { Reveal, eyebrow, h2, sec, secHead } from '../ui.jsx'

const PLATES = [
  { kg: 25, c: '#e5322d', h: 220 },
  { kg: 20, c: '#2a62d9', h: 220 },
  { kg: 15, c: '#f2c230', h: 180 },
  { kg: 10, c: '#2ea05a', h: 140 },
  { kg: 5, c: '#ecebe4', h: 100 },
  { kg: 2.5, c: '#444', h: 80 },
  { kg: 1.25, c: '#888', h: 64 },
]
const BW = 67
const LIFTS = [
  { kg: 200, name: 'Deadlift', tab: 'Deadlift' },
  { kg: 150, name: 'Squat', tab: 'Squat' },
  { kg: 90, name: 'Bench Press', tab: 'Bench' },
]

const split = (total) => {
  let side = (total - 20) / 2
  const out = []
  PLATES.forEach((p) => { while (side + 1e-9 >= p.kg) { out.push(p); side -= p.kg } })
  return out
}

function Bar({ total, replay }) {
  const ps = split(total)
  const cy = 130
  let xr = 600
  let xl = 300
  const nodes = ps.map((p, i) => {
    const w = 22 + Math.min(p.kg, 25) * 0.55
    const cls = 'animate-plate [transform-box:fill-box] origin-center'
    const st = { animationDelay: i * 110 + 'ms' }
    const rx = xr, lx = xl
    xr += w + 4
    xl -= w + 4
    return (
      <g key={`${replay}-${total}-${i}`}>
        <g className={cls} style={st}>
          <rect x={rx} y={cy - p.h / 2} width={w} height={p.h} rx="5" fill={p.c} stroke="rgba(0,0,0,.35)" />
          <text x={rx + w / 2} y={cy + 5} fontFamily="JetBrains Mono,monospace" fontSize="13" fontWeight="500" textAnchor="middle" fill={p.kg === 5 || p.kg === 15 ? '#111' : '#fff'} transform={`rotate(-90 ${rx + w / 2} ${cy})`}>{p.kg}</text>
        </g>
        <g className={cls} style={st}>
          <rect x={lx - w} y={cy - p.h / 2} width={w} height={p.h} rx="5" fill={p.c} stroke="rgba(0,0,0,.35)" />
        </g>
      </g>
    )
  })
  const collarSt = { animationDelay: ps.length * 110 + 'ms' }
  return (
    <svg viewBox="0 0 900 260" role="img" aria-label="Barbell loaded with plates" className="w-full h-auto overflow-visible">
      <rect x="0" y={cy - 5} width="900" height="10" rx="4" fill="#9a9a94" />
      <rect x="40" y={cy - 9} width="12" height="18" rx="3" fill="#6d6d68" />
      <rect x="848" y={cy - 9} width="12" height="18" rx="3" fill="#6d6d68" />
      <rect x="330" y={cy - 8} width="240" height="16" rx="2" fill="#b9b9b2" />
      {nodes}
      <rect key={`cr${replay}${total}`} x={xr + 2} y={cy - 14} width="16" height="28" rx="4" fill="#d6ff3d" className="animate-plate [transform-box:fill-box] origin-center" style={collarSt} />
      <rect key={`cl${replay}${total}`} x={xl - 18} y={cy - 14} width="16" height="28" rx="4" fill="#d6ff3d" className="animate-plate [transform-box:fill-box] origin-center" style={collarSt} />
    </svg>
  )
}

const pbCard = 'border border-line rounded-[22px] p-[26px] bg-card transition-[border-color,transform] duration-300 hover:border-acc hover:-translate-y-1'
const pbH = 'font-disp font-bold uppercase text-[1.7rem] leading-[1.15] mt-[10px] text-muted'
const pbB = 'block text-ink text-[2.4rem] font-black'

export default function Lab() {
  const [i, setI] = useState(0)
  const [replay, setReplay] = useState(0)
  const rack = useRef(null)
  const lift = LIFTS[i]
  const shown = useCount(lift.kg, { ms: 700, pow: 3 })

  // replay the plate-loading once when the rack scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReplay(1); io.disconnect() } }, { threshold: 0.4 })
    io.observe(rack.current)
    return () => io.disconnect()
  }, [])

  const side = {}
  split(lift.kg).forEach((p) => { side[p.kg] = (side[p.kg] || 0) + 1 })

  return (
    <section id="lab" className={`${sec} bg-bg2 border-y border-line`}>
      <Reveal className={secHead}>
        <p className={eyebrow}>02 — The Numbers</p>
        <h2 className={h2}>Personal bests,<br /><em>loaded on the bar.</em></h2>
        <p className="text-muted mt-[18px] max-w-[46ch]">Pick a lift. The bar loads itself — standard 20 kg bar, competition plates.</p>
      </Reveal>

      <Reveal className="bg-card border border-line rounded-[28px] p-[clamp(18px,3vw,40px)] overflow-hidden" innerRef={rack}>
        <div role="tablist" className="inline-flex bg-bg border border-line rounded-full p-1 mb-[10px]">
          {LIFTS.map((l, n) => (
            <button
              key={l.tab}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`py-[10px] px-[22px] rounded-full font-bold text-[.9rem] transition-all duration-[250ms] ${n === i ? 'bg-acc text-accink' : 'text-muted'}`}
            >
              {l.tab}
            </button>
          ))}
        </div>
        <div className="mx-[-6px] my-[10px]"><Bar total={lift.kg} replay={replay} /></div>
        <div className="grid grid-cols-3 max-[760px]:grid-cols-2 gap-5 border-t border-line pt-6 items-end">
          <div className="max-[760px]:col-span-full">
            <small className="mono block text-muted mb-1.5">{lift.name}</small>
            <b className="font-disp font-black text-[clamp(3.4rem,8vw,6.4rem)] leading-[.85]">{shown}<i className="not-italic text-[.32em] text-acc ml-1.5">kg</i></b>
          </div>
          <div>
            <small className="mono block text-muted mb-1.5">Each side</small>
            <p className="mono leading-[1.8] text-ink">
              {Object.entries(side).sort((a, b) => b[0] - a[0]).map(([k, n]) => (<span key={k}>{n} × {k} kg<br /></span>))}
            </p>
          </div>
          <div>
            <small className="mono block text-muted mb-1.5">Bodyweight</small>
            <b className="font-disp font-black text-[clamp(2rem,4vw,3.2rem)] leading-[.85]">67<i className="not-italic text-[.32em] text-acc ml-1.5">kg</i></b>
            <span className="mono block text-acc mt-1.5">{(lift.kg / BW).toFixed(1)}× bodyweight</span>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-3 max-[980px]:grid-cols-1 gap-4 mt-4">
        <Reveal own className={pbCard}>
          <span className="mono text-acc">Running</span>
          <h3 className={pbH}>5 km <b className={pbB}>sub 25:00</b></h3>
          <h3 className={pbH}>21 km <b className={pbB}>sub 2:00:00</b></h3>
          <p className="text-muted mt-[14px] text-[.9rem]">Finisher, Hyderabad 5K.</p>
        </Reveal>
        <Reveal own className={pbCard}>
          <span className="mono text-acc">Cycling</span>
          <h3 className={pbH}>155 km <b className={pbB}>sub 8 hr</b></h3>
          <p className="text-muted mt-[14px] text-[.9rem]">Hyderabad Cycling Revolution &amp; AIG Cyclothon rider.</p>
        </Reveal>
        <Reveal own className={pbCard}>
          <span className="mono text-acc">Street Lifting</span>
          <h3 className={pbH}>Parallel dips <b className={pbB}>+50 kg</b></h3>
          <h3 className={pbH}>Chin-up <b className={pbB}>+50 kg</b></h3>
          <p className="text-muted mt-[14px] text-[.9rem]">Weighted calisthenics.</p>
        </Reveal>
      </div>
    </section>
  )
}
