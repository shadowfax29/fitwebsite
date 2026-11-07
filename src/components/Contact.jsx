import { useState } from 'react'
import { Arrow, Reveal, btn, eyebrow, h2, secHead } from '../ui.jsx'

const goals = ['Get stronger', 'Build muscle', 'Improve endurance', 'Master bodyweight moves', 'Hybrid fitness']
const goalLabel = { 'Master bodyweight moves': 'Master bodyweight' }

const field =
  'bg-transparent border-0 border-b-2 border-accink py-[10px] font-medium text-[1.1rem] font-body text-accink rounded-none resize-y placeholder:text-[rgba(16,19,10,.45)] focus:outline-none focus:border-black focus:shadow-[0_4px_0_-2px_#000]'
const label = 'grid gap-2 font-bold text-[.85rem]'

const links = [
  ['https://instagram.com/mrrk_27', 'Instagram', '@mrrk_27', true],
  ['mailto:ravi.kiran200011@gmail.com', 'Email', 'ravi.kiran200011@gmail.com'],
  ['tel:+919206559141', 'Phone', '+91 92065 59141'],
]

export default function Contact() {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(goals[0])
  const [msg, setMsg] = useState('')

  // opens WhatsApp with the message pre-filled; the visitor taps send there
  const submit = (e) => {
    e.preventDefault()
    const text = `Hi Ravi, I'm ${name.trim()}. My goal: ${goal}.${msg.trim() ? '\n' + msg.trim() : ''}`
    open('https://wa.me/919206559141?text=' + encodeURIComponent(text), '_blank', 'noopener')
  }

  return (
    <section id="contact" className="relative z-[1] py-[clamp(72px,11vw,150px)] px-[var(--pad)] bg-acc text-accink">
      <Reveal className={secHead}>
        <p className={`${eyebrow} !text-[rgba(16,19,10,.6)]`}>06 — Let's train</p>
        <h2 className={h2}>
          Ready for your<br /><em className="bg-accink text-acc px-[.12em] inline-block">first rep?</em>
        </h2>
      </Reveal>

      <div className="grid grid-cols-[1.2fr_.8fr] max-[980px]:grid-cols-1 gap-[clamp(24px,5vw,80px)]">
        <Reveal as="form" onSubmit={submit} className="grid gap-[22px]">
          <label className={label}>
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" autoComplete="name" className={field} />
          </label>
          <fieldset>
            <legend className={`${label} mb-2`}>Your goal</legend>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <label key={g} className="block cursor-pointer relative">
                  <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g)} className="peer absolute opacity-0" />
                  <span className="block border-2 border-accink rounded-full py-2 px-4 font-bold text-[.85rem] transition-all duration-200 peer-checked:bg-accink peer-checked:text-acc peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-black peer-focus-visible:outline-offset-2">
                    {goalLabel[g] || g}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className={label}>
            Anything I should know?
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Experience, injuries, schedule…" className={field} />
          </label>
          <button type="submit" className={`${btn} bg-accink text-acc justify-self-start hover:bg-black`}>
            Send on WhatsApp <Arrow />
          </button>
          <p className="mono text-[rgba(16,19,10,.6)]">Opens WhatsApp with your message pre-filled.</p>
        </Reveal>

        <Reveal className="grid content-start">
          {links.map(([href, k, v, ext], i) => (
            <a
              key={k}
              href={href}
              {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
              className={`block py-[22px] border-b-2 border-accink transition-[padding] duration-300 hover:pl-[14px] ${i === 0 ? 'border-t-2' : ''}`}
            >
              <small className="mono block opacity-60">{k}</small>
              <b className="font-disp font-extrabold text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.1] [word-break:break-word]">{v}</b>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
