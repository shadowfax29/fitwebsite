import { useEffect, useRef, useState } from 'react'
import { Reveal, eyebrow, h2, sec, secHead } from '../ui.jsx'

const media = [
  { type: 'img', src: '/assets/img/p1.webp', alt: 'Ravi Kiran with a finisher medal at the Hyderabad 5K' },
  { type: 'video', src: '/assets/vid/IMG_9315.mp4', poster: '/assets/vid/IMG_9315.jpg' },
  { type: 'img', src: '/assets/img/p7.webp', alt: 'Ravi Kiran holding a handstand on parallettes' },
  { type: 'video', src: '/assets/vid/IMG_9375.mp4', poster: '/assets/vid/IMG_9375.jpg' },
  { type: 'img', src: '/assets/img/p6.webp', alt: 'Ravi Kiran at lockout on a heavy deadlift' },
]

const list = [
  ['Hybrid Training', 'Lift heavy and still run far. Programming that builds strength without sacrificing the engine — from 5K to half marathon to 155 km in the saddle.'],
  ['Powerlifting', 'Squat, bench, deadlift — taught with tight technique and progressive overload. Personal bests: 150 / 90 / 200 kg.'],
  ['Calisthenics', 'Handstands, planche work, dips and pull-ups — then loaded with weight. Master your bodyweight first, then add to it.'],
  ['Functional Fitness', 'Movement that carries over to real life: stability, unilateral strength, mobility and control under load.'],
  ['Strength & Conditioning', 'Structured blocks that build muscle, raise work capacity and keep joints healthy for the long run.'],
]

export default function Disciplines() {
  const [k, setK] = useState(0)
  const vids = useRef({})

  useEffect(() => {
    Object.entries(vids.current).forEach(([i, v]) => {
      if (!v) return
      if (+i === k) v.play().catch(() => {})
      else v.pause()
    })
  }, [k])

  const hoverSet = (i) => matchMedia('(hover:hover)').matches && setK(i)

  return (
    <section id="disciplines" className={sec}>
      <Reveal className={secHead}>
        <p className={eyebrow}>01 — Disciplines</p>
        <h2 className={h2}>One body.<br /><em>Five ways to train it.</em></h2>
      </Reveal>

      <div className="grid grid-cols-[.9fr_1.1fr] max-[980px]:grid-cols-1 gap-[clamp(24px,5vw,80px)] items-start">
        <div className="sticky top-24 aspect-[4/5] max-h-[78vh] w-full rounded-3xl overflow-hidden border border-line bg-card max-[980px]:relative max-[980px]:top-0 max-[980px]:aspect-square max-[980px]:max-h-none">
          {media.map((m, i) => {
            const cls = `absolute inset-0 w-full h-full object-cover ${i === k ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]'}`
            const style = { transition: 'opacity .6s, transform 1s' }
            return m.type === 'img' ? (
              <img key={i} className={cls} style={style} src={m.src} alt={m.alt} loading="lazy" />
            ) : (
              <video key={i} ref={(el) => (vids.current[i] = el)} className={cls} style={style} src={m.src} poster={m.poster} muted loop playsInline preload="none" />
            )
          })}
          <div className="mono absolute right-4 top-4 z-[2] bg-[rgba(11,11,10,.7)] backdrop-blur-lg py-1.5 px-3 rounded-full">
            <b className="text-acc font-medium">{String(k + 1).padStart(2, '0')}</b> / 05
          </div>
        </div>

        <ol className="border-t border-line">
          {list.map(([title, text], i) => {
            const on = i === k
            return (
              <li
                key={title}
                tabIndex={0}
                onMouseEnter={() => hoverSet(i)}
                onClick={() => setK(i)}
                onFocus={() => setK(i)}
                className={`grid grid-cols-[56px_1fr] max-[760px]:grid-cols-[40px_1fr] gap-3 py-[30px] max-[760px]:py-[22px] border-b border-line cursor-pointer transition-[opacity,padding] duration-300 hover:opacity-100 ${on ? 'opacity-100' : 'opacity-45'}`}
              >
                <span className="mono text-acc pt-3">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={`font-disp font-extrabold uppercase text-[clamp(2rem,4.6vw,3.8rem)] leading-none transition-transform duration-300 ${on ? 'translate-x-[10px] text-acc' : ''}`}>{title}</h3>
                  <p className={`text-muted overflow-hidden max-w-[48ch] transition-[max-height,margin] duration-500 ${on ? 'max-h-[140px] mt-3' : 'max-h-0'}`}>{text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
