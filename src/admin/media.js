// Browser-side media prep, so uploads stay small without any server.
const stamp = () => Date.now().toString(36)
const slug = (name) =>
  name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'file'

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(blob)
  })

const canvasToBlob = (canvas, type, q) => new Promise((res) => canvas.toBlob(res, type, q))

function draw(source, w, h, max) {
  const scale = Math.min(1, max / Math.max(w, h))
  const c = document.createElement('canvas')
  c.width = Math.round(w * scale)
  c.height = Math.round(h * scale)
  c.getContext('2d').drawImage(source, 0, 0, c.width, c.height)
  return c
}

/** any browser-readable image -> WebP, longest side <= 1600px */
export async function prepareImage(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const blob = await canvasToBlob(draw(bmp, bmp.width, bmp.height, 1600), 'image/webp', 0.8)
  const path = `assets/img/${slug(file.name)}-${stamp()}.webp`
  return { path, base64: await blobToBase64(blob), url: URL.createObjectURL(blob), size: blob.size }
}

/** videos are uploaded as-is; a JPG poster is taken from the first frames */
export async function prepareVideo(file) {
  const id = `${slug(file.name)}-${stamp()}`
  const ext = (file.name.match(/\.(mp4|webm|mov)$/i) || [, 'mp4'])[1].toLowerCase()
  const src = URL.createObjectURL(file)

  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'auto'
  v.src = src
  await new Promise((res, rej) => { v.onloadeddata = res; v.onerror = () => rej(new Error('Could not read this video.')) })
  v.currentTime = Math.min(0.3, (v.duration || 1) / 2)
  await new Promise((res) => { v.onseeked = res })
  const poster = await canvasToBlob(draw(v, v.videoWidth, v.videoHeight, 1080), 'image/jpeg', 0.8)

  return {
    video: { path: `assets/vid/${id}.${ext}`, base64: await blobToBase64(file), url: src, size: file.size },
    poster: { path: `assets/vid/${id}.jpg`, base64: await blobToBase64(poster), url: URL.createObjectURL(poster), size: poster.size },
  }
}
