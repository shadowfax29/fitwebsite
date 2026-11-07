import { Reveal, eyebrow, h2, sec } from '../ui.jsx'

import content, { asset } from '../content.js'

const about = content.about
const facts = about.facts.map((f) => [f.title, f.text])

export default function About() {
  return (
    <section id="about" className={`${sec} grid grid-cols-[.8fr_1.2fr] max-[980px]:grid-cols-1 gap-[clamp(24px,6vw,90px)] items-center`}>
      <Reveal className="relative aspect-[3/4] rounded-[26px] overflow-hidden border border-line max-[980px]:max-w-[420px]">
        <img className="w-full h-full object-cover" src={asset(about.media.src)} alt={about.media.alt || ''} loading="lazy" />
        <span className="mono absolute left-4 bottom-4 bg-acc text-accink py-2 px-[14px] rounded-full font-medium">{about.badge}</span>
      </Reveal>
      <Reveal>
        <p className={eyebrow}>05 — About</p>
        <h2 className={`${h2} mb-6`}>Discipline first.<br /><em>Results follow.</em></h2>
        <p className="text-[#c9c6bc] max-w-[58ch]">
          {about.text}
        </p>
        <dl className="mono mt-8 grid grid-cols-2 max-[760px]:grid-cols-1 border-t border-line">
          {facts.map(([k, v]) => (
            <div key={k} className="py-4 border-b border-line">
              <dt className="text-muted mb-1">{k}</dt>
              <dd className="normal-case tracking-[.02em] text-[.88rem]">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
