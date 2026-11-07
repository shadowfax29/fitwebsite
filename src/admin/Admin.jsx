import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { asset } from '../content.js'
import { commitFiles, loadContent, verify } from './github.js'
import { prepareImage, prepareVideo } from './media.js'
import { sections } from './schema.js'

const Ctx = createContext(null)
const SAVED = 'rk-admin-login'
const MAX_VIDEO_MB = 40

const input =
  'w-full bg-bg border border-line rounded-lg px-3 py-2 text-ink text-[.95rem] focus:outline-none focus:border-acc'
const btn = 'rounded-full px-4 py-2 text-[.85rem] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const ghost = `${btn} border border-line hover:border-ink`
const solid = `${btn} bg-acc text-accink hover:bg-[#e6ff7a]`

const blank = (f) => {
  if (f.type === 'group') return Object.fromEntries(f.fields.map((x) => [x.key, blank(x)]))
  if (f.type === 'list' || f.type === 'strings') return []
  if (f.type === 'media') return { type: f.only === 'video' ? 'video' : 'image', src: '', alt: '' }
  return ''
}

/* ---------- field renderers ---------- */

function Media({ def, value, onChange }) {
  const { addPending, preview } = useContext(Ctx)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const only = def.only
  const accept = only === 'image' ? 'image/*' : only === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*,video/mp4,video/webm,video/quicktime'
  const isVideo = value?.type === 'video'

  const pick = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      if (file.type.startsWith('video/')) {
        if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`Video is ${(file.size / 1048576).toFixed(0)} MB — keep it under ${MAX_VIDEO_MB} MB (compress it first, 1080p, no audio is ideal).`)
        const { video, poster } = await prepareVideo(file)
        addPending(video)
        addPending(poster)
        onChange({ type: 'video', src: video.path, poster: poster.path })
      } else {
        const img = await prepareImage(file)
        addPending(img)
        onChange({ type: 'image', src: img.path, alt: value?.alt || '' })
      }
    } catch (x) {
      setErr(x.message || 'Could not process that file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex gap-4 items-start flex-wrap">
      <div className="w-[110px] aspect-[3/4] rounded-xl overflow-hidden bg-bg border border-line shrink-0 grid place-items-center text-muted text-xs">
        {value?.src ? (
          isVideo ? (
            <video src={preview(value.src)} poster={preview(value.poster)} className="w-full h-full object-cover" muted loop playsInline onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => e.target.pause()} />
          ) : (
            <img src={preview(value.src)} alt="" className="w-full h-full object-cover" />
          )
        ) : 'empty'}
      </div>
      <div className="grid gap-2 flex-1 min-w-[200px]">
        <label className={`${ghost} inline-block text-center cursor-pointer w-fit`}>
          {busy ? 'Processing…' : value?.src ? 'Replace file' : 'Choose file'}
          <input type="file" accept={accept} onChange={pick} disabled={busy} className="hidden" />
        </label>
        {!isVideo && (
          <input className={input} placeholder="Describe the image (alt text, for accessibility)" value={value?.alt || ''} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
        )}
        <small className="text-muted break-all">{value?.src || 'No file yet'}{isVideo ? ' · poster auto-generated' : ''}</small>
        {err && <small className="text-[#ff7a70]">{err}</small>}
      </div>
    </div>
  )
}

function Strings({ def, value = [], onChange }) {
  return (
    <div className="grid gap-2">
      {value.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input className={input} value={s} onChange={(e) => onChange(value.map((x, n) => (n === i ? e.target.value : x)))} />
          <button className={ghost} onClick={() => onChange(value.filter((_, n) => n !== i))} aria-label="Remove">✕</button>
        </div>
      ))}
      <button className={`${ghost} w-fit`} onClick={() => onChange([...value, ''])}>+ Add</button>
    </div>
  )
}

function List({ def, value = [], onChange }) {
  const [open, setOpen] = useState(0)
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(j)
  }
  const label = (it, i) => (def.item ? def.item(it) : '') || `Item ${i + 1}`
  return (
    <div className="grid gap-2">
      {value.map((it, i) => (
        <div key={i} className="border border-line rounded-xl bg-bg2">
          <div className="flex items-center gap-2 px-3 py-2">
            <button className="flex-1 text-left font-semibold truncate" onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="mono text-acc mr-2">{String(i + 1).padStart(2, '0')}</span>{label(it, i)}
            </button>
            {!def.fixed && (
              <>
                <button className={ghost} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                <button className={ghost} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                <button className={ghost} onClick={() => confirm('Remove this item?') && onChange(value.filter((_, n) => n !== i))} aria-label="Remove">✕</button>
              </>
            )}
          </div>
          {open === i && (
            <div className="p-3 border-t border-line grid gap-4">
              <Fields fields={def.fields} value={it} onChange={(v) => onChange(value.map((x, n) => (n === i ? v : x)))} />
            </div>
          )}
        </div>
      ))}
      {!def.fixed && (
        <button className={`${ghost} w-fit`} onClick={() => { onChange([...value, blank({ type: 'group', fields: def.fields })]); setOpen(value.length) }}>
          + Add
        </button>
      )}
    </div>
  )
}

function Field({ def, value, onChange }) {
  const wrap = (child) => (
    <div className="grid gap-1.5">
      <span className="mono text-muted">{def.label}</span>
      {child}
      {def.hint && <small className="text-muted">{def.hint}</small>}
    </div>
  )
  switch (def.type) {
    case 'text': return wrap(<input className={input} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />)
    case 'area': return wrap(<textarea className={`${input} min-h-[96px]`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />)
    case 'media': return wrap(<Media def={def} value={value} onChange={onChange} />)
    case 'strings': return wrap(<Strings def={def} value={value} onChange={onChange} />)
    case 'list': return wrap(<List def={def} value={value} onChange={onChange} />)
    case 'group':
      return (
        <fieldset className="grid gap-4 border border-line rounded-xl p-4">
          {def.label && <legend className="mono text-acc px-2">{def.label}</legend>}
          <Fields fields={def.fields} value={value} onChange={onChange} />
        </fieldset>
      )
    default: return null
  }
}

function Fields({ fields, value = {}, onChange }) {
  return fields.map((f) => (
    <Field key={f.key} def={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
  ))
}

/* ---------- login ---------- */

function Login({ onDone }) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVED)) || {} } catch { return {} } })()
  const [repo, setRepo] = useState(saved.repo || 'shadowfax29/fitwebsite')
  const [branch, setBranch] = useState(saved.branch || 'main')
  const [token, setToken] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const login = { repo: repo.trim(), branch: branch.trim(), token: token.trim() }
      await verify(login)
      const content = await loadContent(login)
      try { localStorage.setItem(SAVED, JSON.stringify({ repo: login.repo, branch: login.branch })) } catch { /* private mode */ }
      onDone(login, content)
    } catch (x) {
      setErr(x.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-5 py-10">
      <form onSubmit={go} className="w-full max-w-[460px] grid gap-4 bg-card border border-line rounded-3xl p-7">
        <h1 className="font-disp font-black uppercase text-3xl">Site admin</h1>
        <p className="text-muted text-[.9rem]">
          Changes are saved straight to your GitHub repo as a commit, and the site rebuilds itself. Paste a fine-grained personal access token with
          <b className="text-ink"> Contents: Read and write</b> on this one repo.
        </p>
        <label className="grid gap-1.5"><span className="mono text-muted">Repository</span><input className={input} value={repo} onChange={(e) => setRepo(e.target.value)} required /></label>
        <label className="grid gap-1.5"><span className="mono text-muted">Branch</span><input className={input} value={branch} onChange={(e) => setBranch(e.target.value)} required /></label>
        <label className="grid gap-1.5"><span className="mono text-muted">Access token</span><input className={input} type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" autoComplete="off" required /></label>
        {err && <p className="text-[#ff7a70] text-[.85rem]">{err}</p>}
        <button className={solid} disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        <small className="text-muted">The token is kept only in memory for this tab — you'll paste it again next time. <a className="text-acc" href="#top" onClick={() => (location.hash = '')}>Back to site</a></small>
      </form>
    </main>
  )
}

/* ---------- editor ---------- */

function Editor({ login, initial, onExit }) {
  const [content, setContent] = useState(initial)
  const [pending, setPending] = useState({})
  const [tab, setTab] = useState(sections[0].id)
  const [status, setStatus] = useState(null) // {kind:'ok'|'err'|'busy', msg}
  const original = useRef(JSON.stringify(initial))
  const dirty = JSON.stringify(content) !== original.current

  useEffect(() => {
    const warn = (e) => { if (dirty) e.preventDefault() }
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [dirty])

  const ctx = useMemo(() => ({
    addPending: (f) => setPending((p) => ({ ...p, [f.path]: f })),
    preview: (path) => (path ? pending[path]?.url || asset(path) : ''),
  }), [pending])

  const section = sections.find((s) => s.id === tab)
  const f = section.field
  const value = f.key ? content[f.key] : content
  const setValue = (v) => setContent(f.key ? { ...content, [f.key]: v } : v)

  const save = async () => {
    setStatus({ kind: 'busy', msg: 'Saving to GitHub…' })
    try {
      const json = JSON.stringify(content, null, 2) + '\n'
      const files = [{ path: 'src/content.json', text: json }]
      Object.values(pending).forEach((p) => { if (json.includes(p.path)) files.push({ path: `public/${p.path}`, base64: p.base64 }) })
      await commitFiles({ ...login, message: `Update site content (${files.length - 1} media)`, files })
      original.current = JSON.stringify(content)
      setPending({})
      setStatus({ kind: 'ok', msg: 'Saved. The site rebuilds in about a minute — refresh the live site then.' })
    } catch (x) {
      setStatus({ kind: 'err', msg: x.message })
    }
  }

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 bg-[rgba(11,11,10,.92)] backdrop-blur-md border-b border-line px-5 py-3 flex items-center gap-3 flex-wrap">
          <b className="font-disp font-extrabold uppercase text-xl mr-auto">Site admin <span className="mono text-muted ml-2">{login.repo}</span></b>
          {status && <span className={`text-[.85rem] ${status.kind === 'err' ? 'text-[#ff7a70]' : status.kind === 'ok' ? 'text-acc' : 'text-muted'}`}>{status.msg}</span>}
          <a className={ghost} href={import.meta.env.BASE_URL} target="_blank" rel="noopener">View site</a>
          <button className={ghost} onClick={() => (!dirty || confirm('Discard unsaved changes?')) && onExit()}>Sign out</button>
          <button className={solid} onClick={save} disabled={!dirty || status?.kind === 'busy'}>{dirty ? 'Save changes' : 'No changes'}</button>
        </header>

        <div className="grid grid-cols-[200px_1fr] max-[760px]:grid-cols-1 gap-6 p-5 max-w-[1100px] mx-auto">
          <nav className="flex flex-col max-[760px]:flex-row max-[760px]:overflow-x-auto gap-1 md:sticky md:top-20 self-start">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)} className={`text-left px-4 py-2 rounded-full font-semibold whitespace-nowrap ${tab === s.id ? 'bg-acc text-accink' : 'text-muted hover:text-ink'}`}>
                {s.label}
              </button>
            ))}
          </nav>
          <div className="grid gap-5 content-start pb-24">
            <Field key={tab} def={{ ...f, label: f.type === 'group' ? '' : f.label }} value={value} onChange={setValue} />
          </div>
        </div>
      </div>
    </Ctx.Provider>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  return session ? (
    <Editor login={session.login} initial={session.content} onExit={() => setSession(null)} />
  ) : (
    <Login onDone={(login, content) => setSession({ login, content })} />
  )
}
