// Reveal observer + per-grid reveal counters for staggered transitions
const _revealCounters = new Map()
const _revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const img = entry.target
    obs.unobserve(img)
    const order = Number(img.dataset.revealOrder) || 0
    const delay = Math.min(order * 80, 800)
    img.style.transitionDelay = `${delay}ms`
    img.classList.add('in-view')
    if (img.complete && img.naturalWidth) img.classList.add('loaded')
  })
}, { rootMargin: '0px 0px 120px 0px', threshold: 0.08 })

// Generic loader: fetch a manifest and render images into the given gridId.
async function loadImages(manifestPath, gridId, srcPrefix = '') {
  const grid = document.getElementById(gridId)
  if (!grid) return

  try {
    const res = await fetch(manifestPath, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load images manifest: ' + manifestPath)
    const images = await res.json()

    images.forEach((fileName) => {
      const figure = document.createElement('figure')
      figure.className = 'gallery__item'
      figure.style.gridColumnEnd = 'span 1'
      figure.style.gridRowEnd = 'span 1'

      const img = document.createElement('img')
      img.src = `${srcPrefix}${fileName}`
      img.alt = fileName
      img.loading = 'lazy'
      img.classList.add('reveal')
      // assign a per-grid reveal order so reveals are staggered
      const order = _revealCounters.get(gridId) || 0
      img.dataset.revealOrder = order
      _revealCounters.set(gridId, order + 1)

      // append immediately so the layout shows placeholders / broken images
      figure.appendChild(img)
      grid.appendChild(figure)

      img.addEventListener('load', () => {
        const nw = img.naturalWidth || img.width
        const nh = img.naturalHeight || img.height
        const { cols, rows } = computeGridSpan(nw, nh)
        figure.style.gridColumnEnd = `span ${cols}`
        figure.style.gridRowEnd = `span ${rows}`
        img.classList.add('loaded')
      })

      img.addEventListener('error', (e) => {
        figure.classList.add('gallery__item--broken')
        // eslint-disable-next-line no-console
        console.error('Failed to load image', img.src, e)
      })
      // observe for reveal stagger
      _revealObserver.observe(img)
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error loading images from', manifestPath, err)
  }
}

// Compute column/row spans for CSS grid based on image intrinsic size.
// Returns an object {cols, rows} where both are integers >= 1.
function computeGridSpan(naturalWidth, naturalHeight) {
  if (!naturalWidth || !naturalHeight) return { cols: 1, rows: 1 }

  const aspect = naturalHeight / naturalWidth

  // Decide column span: very wide images span 2 columns
  let cols = 1
  if (naturalWidth / naturalHeight > 1.6) cols = 2

  // Row span scales with aspect ratio and chosen columns.
  // The multiplier 2 gives moderate vertical span for tall images.
  const rows = Math.max(1, Math.round(aspect * cols * 2))

  return { cols, rows }
}

// lightbox removed

document.addEventListener('DOMContentLoaded', () => {
  loadImages('./public/soft/images.json', 'softGrid', 'public/soft/')
  loadImages('./public/bridal/images.json', 'bridalGrid', 'public/bridal/')
  loadImages('./public/full/images.json', 'fullGrid', 'public/full/')
  loadImages('./public/artistry/images.json', 'artistryGrid', 'public/artistry/')
  loadImages('./public/client/images.json', 'clientGrid', 'public/client/')
  loadImages('./public/natural/images.json', 'naturalGrid', 'public/natural/')
})
