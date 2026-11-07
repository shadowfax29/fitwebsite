import data from './content.json'

export default data

/** turn a content path like "assets/img/p1.webp" into a URL that respects the deploy base path */
export const asset = (p) => {
  if (!p) return ''
  if (/^(https?:|blob:|data:)/.test(p)) return p
  return import.meta.env.BASE_URL + p.replace(/^\//, '')
}
