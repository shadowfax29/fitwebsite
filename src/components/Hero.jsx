import { useRef } from 'react'
import { useCount, usePlayInView } from '../hooks.js'
import { Arrow, btn, eyebrow } from '../ui.jsx'

const Word = ({ delay, children, className = '' }) => (
  <span className={`inline-block translate-y-[105%] animate-rise motion-reduce:translate-y-0 ${className}`} style={{ animationDelay: delay + 's' }}>
    {children}
  </span>
)
const Line = ({ children }) => <span className="block overflow-hidden pb-[.04em] whitespace-nowrap">{children}</span>

const tags = ['Hybrid Training', 'Powerlifting', 'Calisthenics', 'Functional Fitness', 'Strength & Conditioning']

export default function Hero() {
  const vid = useRef(null)
  usePlayInView(vid)
  const kg = useCount(200, { ms: 1600, delay: 600, pow: 4, initial: 0 })

  return (
    <section className="relative z-[1] min-h-[100svh] grid grid-cols-[1.25fr_.75fr] max-[980px]:grid-cols-1 gap-[clamp(24px,4vw,64px)] items-center pt-[110px] max-[980px]:pt-[100px] pb-[60px] px-[var(--pad)] overflow-x-clip">
      <div>
        <p className={eyebrow}>
          <span className="w-2 h-2 rounded-full bg-acc shadow-[0_0_0_0_rgba(214,255,61,.6)] animate-pulse" /> Fitness Coach · Bengaluru / Hyderabad
        </p>
        <h1 className="font-disp font-black uppercase leading-[.9] tracking-[-.01em] mb-7 text-[clamp(2.4rem,6.3vw,7rem)] max-[980px]:text-[clamp(2.4rem,12.6vw,6.5rem)]">
          <Line><Word delay={0.1}>Build</Word> <Word delay={0.18}><em>strength.</em></Word></Line>
          <Line><Word delay={0.28}>Master</Word> <Word delay={0.36}><em>movement.</em></Word></Line>
          <Line>
            <Word delay={0.46}>Become</Word>{' '}
            <Word delay={0.54}>
              <em className="text-transparent [-webkit-text-stroke:2px_#d6ff3d] max-[760px]:[-webkit-text-stroke:1.5px_#d6ff3d]">your best.</em>
            </Word>
          </Line>
        </h1>
        <p className="max-w-[54ch] text-[#c9c6bc] text-[1.06rem] mb-[30px]">
          I'm <strong className="text-ink">Ravi Kiran</strong>. My approach goes beyond building muscle — it's about developing{' '}
          <strong className="text-ink">strength, endurance, mobility and functional performance</strong>. Powerlifting, running, cycling and weighted calisthenics, all in one capable body.
        </p>
        <div className="flex gap-3 flex-wrap mb-[30px]">
          <a href="#contact" className={`${btn} bg-acc text-accink hover:-translate-y-0.5 hover:bg-[#e6ff7a]`}>
            Start your journey <Arrow />
          </a>
          <a href="#lab" className={`${btn} border border-line hover:border-ink`}>See my numbers</a>
        </div>
        <ul className="mono flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="border border-line py-1.5 px-3 rounded-full text-muted">{t}</li>
          ))}
        </ul>
      </div>

      <div className="group relative justify-self-center w-[min(100%,420px)] max-[980px]:w-[min(78%,340px)] max-[980px]:mt-5">
        <div className="relative aspect-[9/16] rounded-[28px] overflow-hidden border border-line rotate-[2.5deg] group-hover:rotate-0 shadow-[0_40px_90px_-30px_rgba(214,255,61,.25),0_30px_60px_-20px_#000] transition-transform duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,.65))]">
          <video ref={vid} className="w-full h-full object-cover" src="/assets/vid/IMG_9315.mp4" poster="/assets/vid/IMG_9315.jpg" muted loop playsInline autoPlay preload="auto" />
          <div className="mono absolute left-4 bottom-4 z-[2] flex items-center gap-2">
            <span className="w-[9px] h-[9px] rounded-full bg-[#ff3b30] animate-rec" /> LIVE SET · DEADLIFT
          </div>
        </div>
        <div className="absolute z-[3] bg-[rgba(18,18,16,.82)] backdrop-blur-xl border border-line rounded-2xl py-3 px-4 animate-float left-[-8%] top-[14%] max-[980px]:left-[-14%]">
          <small className="mono block text-muted">Deadlift</small>
          <b className="font-disp text-[2.2rem] leading-none font-black">
            {kg}<i className="not-italic text-base text-acc ml-1">kg</i>
          </b>
        </div>
        <div className="absolute z-[3] bg-[rgba(18,18,16,.82)] backdrop-blur-xl border border-line rounded-2xl py-3 px-4 animate-float [animation-delay:-3s] right-[-6%] bottom-[18%] max-[980px]:right-[-12%]">
          <small className="mono block text-muted">Half marathon</small>
          <b className="font-disp text-[2.2rem] leading-none font-black">
            sub 2<i className="not-italic text-base text-acc ml-1">hr</i>
          </b>
        </div>
        <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute -z-[1] w-[150%] left-[-25%] top-[-10%] opacity-50 animate-spin-slow">
          <circle cx="100" cy="100" r="92" className="fill-none stroke-line [stroke-dasharray:3_7]" />
          <circle cx="100" cy="100" r="62" className="fill-none stroke-line [stroke-dasharray:3_7]" />
        </svg>
      </div>
    </section>
  )
}

const items = ['200 KG DEADLIFT', '150 KG SQUAT', '90 KG BENCH', '+50 KG DIPS', '+50 KG CHIN-UP', '5K SUB 25', '21K SUB 2:00', '155 KM RIDE SUB 8 HR']

export function Marquee() {
  const row = [...items, ...items]
  return (
    <div aria-hidden="true" className="relative z-[1] overflow-hidden bg-acc text-accink py-[14px] -rotate-[1.2deg] mx-[-2vw] font-medium">
      <div className="mono flex gap-7 w-max animate-slide text-[.9rem] whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="contents"><span>{t}</span><span>★</span></span>
        ))}
      </div>
    </div>
  )
}
