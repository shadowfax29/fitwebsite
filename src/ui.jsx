import { useReveal } from './hooks.js'

/** fade/slide-up on first scroll into view */
export function Reveal({ as: T = 'div', className = '', own = false, innerRef, children, ...rest }) {
  const [ref, on] = useReveal()
  const base = own ? '' : 'transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.2,.7,.2,1)]'
  return (
    <T
      ref={(el) => { ref.current = el; if (innerRef) innerRef.current = el }}
      className={`${base} motion-reduce:!opacity-100 motion-reduce:!translate-y-0 ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      {...rest}
    >
      {children}
    </T>
  )
}

export const sec = 'relative z-[1] py-[clamp(72px,11vw,150px)] px-[var(--pad)]'
export const secHead = 'mb-[clamp(32px,5vw,64px)]'
export const eyebrow = 'mono text-muted flex items-center gap-[10px] mb-4'
export const h2 =
  'font-disp font-black uppercase leading-[.92] tracking-[-.005em] text-[clamp(2.6rem,7.5vw,6.5rem)]'

export const Arrow = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-[2.2] [stroke-linecap:round] [stroke-linejoin:round] transition-transform duration-[250ms] group-hover/btn:translate-x-1">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const btn =
  'group/btn inline-flex items-center gap-[10px] py-[15px] px-[26px] rounded-full font-bold text-[.95rem] transition-[transform,background,color,border-color] duration-[250ms]'
