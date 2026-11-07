// Minimal GitHub REST client: read content.json, and push several files as ONE commit.
const API = 'https://api.github.com'

async function gh(token, path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json()).message } catch { /* ignore */ }
    const hint =
      res.status === 401 ? 'Token rejected — check it is correct and not expired.'
      : res.status === 403 || res.status === 404 ? 'No access — the token needs "Contents: Read and write" on this repo.'
      : ''
    throw new Error(`GitHub ${res.status}: ${detail || res.statusText}. ${hint}`.trim())
  }
  return res.json()
}

const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)))
const toB64 = (text) => {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin)
}

export async function verify({ token, repo }) {
  const r = await gh(token, `/repos/${repo}`)
  if (r.permissions && !r.permissions.push) throw new Error('This token can read the repo but cannot push to it.')
  return r
}

export async function loadContent({ token, repo, branch }) {
  const f = await gh(token, `/repos/${repo}/contents/src/content.json?ref=${encodeURIComponent(branch)}`)
  return JSON.parse(fromB64(f.content))
}

/** files: [{ path, text }] or [{ path, base64 }] — committed together as a single commit */
export async function commitFiles({ token, repo, branch, message, files }) {
  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`)
  const head = ref.object.sha
  const headCommit = await gh(token, `/repos/${repo}/git/commits/${head}`)

  const tree = []
  for (const f of files) {
    const blob = await gh(token, `/repos/${repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify(f.base64 ? { content: f.base64, encoding: 'base64' } : { content: toB64(f.text), encoding: 'base64' }),
    })
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  const newTree = await gh(token, `/repos/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  })
  const commit = await gh(token, `/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [head] }),
  })
  await gh(token, `/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  })
  return commit
}
