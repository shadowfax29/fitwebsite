import { Reveal, eyebrow, h2, sec, secHead } from '../ui.jsx'

import content from '../content.js'

const cards = content.coaching.cards.map((c) => [c.title, c.text])
const cert = content.coaching.cert.map((c) => [c.title, c.text])

export default function Coaching() {
  return (
    <section id="coaching" className={sec}>
      <Reveal className={secHead}>
        <p className={eyebrow}>04 — Coaching</p>
        <h2 className={h2}>Structured training.<br /><em>Proper guidance. Real progress.</em></h2>
      </Reveal>

      <div className="grid grid-cols-4 max-[980px]:grid-cols-2 max-[760px]:grid-cols-1 gap-4">
        {cards.map(([t, p], i) => (
          <Reveal
            own
            key={t}
            className="group relative overflow-hidden bg-card border border-line rounded-[22px] p-7 min-h-[260px] flex flex-col transition-all duration-300 before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-acc before:transition-[height] before:duration-[400ms] hover:before:h-full"
          >
            <span className="mono relative z-[1] text-acc transition-colors duration-300 group-hover:text-accink">0{i + 1}</span>
            <h3 className="relative z-[1] font-disp font-extrabold uppercase text-[2rem] leading-none mt-auto mb-3 transition-colors duration-300 group-hover:text-accink">{t}</h3>
            <p className="relative z-[1] text-muted text-[.92rem] transition-colors duration-300 group-hover:text-accink">{p}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="grid grid-cols-[.8fr_1.2fr] max-[980px]:grid-cols-1 gap-[30px] mt-4 border border-dashed border-[rgba(214,255,61,.45)] rounded-[22px] p-[clamp(22px,3vw,40px)]">
        <div>
          <p className={eyebrow}>Certification</p>
          <h3 className="font-disp font-black uppercase text-[clamp(2rem,4vw,3.2rem)] leading-[.95]">{content.coaching.certTitle}</h3>
        </div>
        <ul className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-[18px]">
          {cert.map(([b, t]) => (
            <li key={b} className="text-muted text-[.92rem]"><b className="block text-ink mb-0.5">{b}</b> {t}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
