import { useEffect, useState } from 'react'
import { prefersReduced } from '../hooks.js'

export function Progress() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight
      setW(h > 0 ? (scrollY / h) * 100 : 0)
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <div className="fixed top-0 inset-x-0 h-[3px] z-[120]" aria-hidden="true">
      <i className="block h-full bg-acc" style={{ width: w + '%' }} />
    </div>
  )
}

export function Glow() {
  const [p, setP] = useState(null)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches || prefersReduced()) return
    const on = (e) => setP({ x: e.clientX, y: e.clientY })
    addEventListener('pointermove', on, { passive: true })
    return () => removeEventListener('pointermove', on)
  }, [])
  return (
    <div
      aria-hidden="true"
      className="fixed w-[520px] h-[520px] rounded-full left-0 top-0 pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[400ms] bg-[radial-gradient(circle,rgba(214,255,61,.10),transparent_65%)]"
      style={{ opacity: p ? 1 : 0, left: p?.x ?? 0, top: p?.y ?? 0 }}
    />
  )
}

const links = [
  ['#disciplines', 'Disciplines'],
  ['#lab', 'The Numbers'],
  ['#gallery', 'Field Notes'],
  ['#coaching', 'Coaching'],
  ['#about', 'About'],
]

export function Nav() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setStuck(scrollY > 30)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className="fixed top-0 inset-x-0 z-[90] max-[760px]:z-[95] flex items-center justify-between py-[14px] px-[var(--pad)]"
    >
      {/* blur lives on its own layer: a backdrop-filter on the header itself would trap the fixed mobile menu inside it */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-20 border-b transition-[background,backdrop-filter,border-color] duration-300 ${
          stuck ? 'bg-[rgba(11,11,10,.78)] backdrop-blur-[14px] border-line' : 'border-transparent'
        }`}
      />
      <a href="#top" aria-label="Ravi Kiran — home" className="flex items-center gap-[10px] font-disp font-extrabold text-[1.3rem] tracking-[.04em] uppercase">
        <span className="grid place-items-center w-9 h-9 bg-acc text-accink rounded-lg text-[1.05rem]">RK</span>
        <b>Ravi Kiran</b>
      </a>

      <nav
        id="menu"
        aria-label="Primary"
        className={`flex items-center gap-[clamp(14px,2.2vw,32px)] text-[.9rem] font-semibold
          max-[760px]:fixed max-[760px]:inset-0 max-[760px]:bg-bg max-[760px]:flex-col max-[760px]:justify-center max-[760px]:gap-[26px]
          max-[760px]:text-[1.7rem] max-[760px]:font-disp max-[760px]:uppercase max-[760px]:font-extrabold max-[760px]:-z-10
          max-[760px]:transition-transform max-[760px]:duration-[450ms] max-[760px]:ease-[cubic-bezier(.7,0,.2,1)]
          ${open ? 'max-[760px]:translate-y-0' : 'max-[760px]:-translate-y-full max-[760px]:pointer-events-none'}`}
      >
        {links.map(([h, t]) => (
          <a key={h} href={h} onClick={() => setOpen(false)} className="opacity-75 hover:opacity-100 transition-opacity duration-200">{t}</a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)} className="bg-ink text-bg py-[9px] px-[18px] rounded-full transition-[background,transform] duration-200 hover:bg-acc hover:-translate-y-px">
          Train with me
        </a>
      </nav>

      <button
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((o) => !o)}
        className="hidden max-[760px]:block w-11 h-11 relative"
      >
        <i className={`absolute left-[11px] right-[11px] h-0.5 bg-ink top-[18px] transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
        <i className={`absolute left-[11px] right-[11px] h-0.5 bg-ink top-[25px] transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
      </button>
    </header>
  )
}
