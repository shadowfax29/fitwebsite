import content from '../content.js'

const { footer, contact } = content

export default function Footer() {
  return (
    <footer className="relative z-[1] bg-bg pt-[50px] pb-[30px] px-[var(--pad)] overflow-hidden">
      <div aria-hidden="true" className="font-disp font-black text-[clamp(3rem,13.5vw,14rem)] leading-[.85] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(242,239,230,.25)] tracking-[-.01em] mb-6">
        BECOME YOUR BEST
      </div>
      <p className="mono text-muted">
        © {new Date().getFullYear()} {footer.legalName} · {footer.tagline} ·{' '}
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener"
          className="text-ink hover:text-acc transition-colors duration-200"
        >
          Instagram {contact.instagramHandle}
        </a>
      </p>
    </footer>
  )
}
