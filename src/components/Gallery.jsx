import { useEffect, useRef } from 'react'
import { usePlayInView } from '../hooks.js'
import { Reveal, eyebrow, h2, secHead } from '../ui.jsx'

import content, { asset } from '../content.js'

const items = content.gallery

const mediaCls = 'w-full h-full object-cover pointer-events-none transition-transform duration-[800ms] group-hover/fig:scale-[1.06]'

function Clip({ src, poster }) {
  const ref = useRef(null)
  usePlayInView(ref)
  return <video ref={ref} className={mediaCls} src={asset(src)} poster={asset(poster)} muted loop playsInline preload="none" />
}

const Chevron = ({ d }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.2] [stroke-linecap:round] [stroke-linejoin:round]"><path d={d} /></svg>
)
const arrowBtn = 'w-[52px] h-[52px] border border-line rounded-full grid place-items-center transition-all duration-[250ms] hover:bg-acc hover:text-accink hover:border-acc'

export default function Gallery() {
  const strip = useRef(null)
  const drag = useRef({ down: false, sx: 0, sl: 0 })

  const step = () => strip.current.querySelector('figure').getBoundingClientRect().width + 16
  const scrollByStep = (dir) => strip.current.scrollBy({ left: dir * step(), behavior: 'smooth' })

  useEffect(() => {
    const el = strip.current
    const up = () => { drag.current.down = false; el.classList.remove('drag') }
    const move = (e) => { if (drag.current.down) el.scrollLeft = drag.current.sl - (e.clientX - drag.current.sx) }
    addEventListener('pointerup', up)
    addEventListener('pointermove', move)
    return () => { removeEventListener('pointerup', up); removeEventListener('pointermove', move) }
  }, [])

  const down = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { down: true, sx: e.clientX, sl: strip.current.scrollLeft }
    strip.current.classList.add('drag')
  }

  return (
    <section id="gallery" className="relative z-[1] py-[clamp(72px,11vw,150px)] px-0 overflow-hidden">
      <Reveal className={`${secHead} px-[var(--pad)] flex justify-between items-end gap-5 flex-wrap`}>
        <div>
          <p className={eyebrow}>03 — Field Notes</p>
          <h2 className={h2}>Gym floor.<br /><em>Race day. Street bars.</em></h2>
        </div>
        <div className="flex gap-[10px]">
          <button aria-label="Previous" onClick={() => scrollByStep(-1)} className={arrowBtn}><Chevron d="M19 12H5M11 6l-6 6 6 6" /></button>
          <button aria-label="Next" onClick={() => scrollByStep(1)} className={arrowBtn}><Chevron d="M5 12h14M13 6l6 6-6 6" /></button>
        </div>
      </Reveal>

      <div
        ref={strip}
        onPointerDown={down}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-[var(--pad)] pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab [&.drag]:cursor-grabbing [&.drag]:snap-none"
      >
        {items.map((it) => (
          <figure
            key={it.tag + it.media.src}
            className="group/fig relative shrink-0 basis-[clamp(240px,26vw,380px)] aspect-[3/4] rounded-[22px] overflow-hidden snap-start border border-line bg-card even:mt-9 max-[760px]:even:mt-0 after:content-[''] after:absolute after:inset-x-0 after:top-1/2 after:bottom-0 after:bg-[linear-gradient(transparent,rgba(0,0,0,.85))]"
          >
            {it.media.type === 'video' ? (
              <Clip src={it.media.src} poster={it.media.poster} />
            ) : (
              <img className={mediaCls} src={asset(it.media.src)} alt={it.media.alt || ''} loading="lazy" />
            )}
            <figcaption className="absolute z-[2] left-[18px] right-[18px] bottom-4 text-[.92rem] leading-[1.35]">
              <b className="mono block text-acc mb-1 font-bold">{it.tag}</b>
              {it.cap}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
