# Chinmay Agrawal — Portfolio

A modern, professionally designed personal portfolio website showcasing design philosophy, projects, and technical expertise.

## Project Structure

```
.
├── src/                          # Source files
│   ├── index.html               # Homepage
│   ├── portfolio-design.html     # Portfolio design detail page
│   ├── css/                      # Stylesheets
│   │   ├── styles.css
│   │   └── portfolio-design.css
│   ├── js/
│   │   └── main.js              # Main JavaScript (animations, interactions)
│   └── assets/
│       └── images/              # Images and SVG assets
├── dist/                         # Production build (minified)
├── api/                          # Serverless API routes
│   └── contact.js
├── build.js                      # Build script (minification)
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Development

```bash
# Run development server (serves from src/)
npm run dev
# Access at http://localhost:8000
```

### Production Build

```bash
# Minify CSS/JS and prepare dist/
npm run build

# Serve production build
npm run serve
# Access at http://localhost:8000
```

## Build Process

The `build.js` script:
1. **Minifies CSS** — Removes comments, collapses whitespace, reduces file size by ~25-28%
2. **Minifies JavaScript** — Strips comments, compresses code, reduces file size by ~30%
3. **Updates references** — HTML automatically points to minified files (`.min.css`, `.min.js`)
4. **Copies assets** — Preserves all images and SVG files in `/assets`

### Build Output

- **styles.css** → styles.min.css (27.9% smaller)
- **portfolio-design.css** → portfolio-design.min.css (23.9% smaller)
- **main.js** → main.min.js (29.7% smaller)

## Technologies

**Frontend**
- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript

**Libraries**
- [Lenis](https://github.com/studio-freight/lenis) — Smooth scrolling
- [GSAP](https://greensock.com/gsap/) — Animation library
- [ScrollTrigger](https://greensock.com/scrolltrigger/) — Scroll-based animations

**Design System**
- Typography: Cormorant Garamond (serif) + DM Sans (sans-serif)
- Color Palette: Dark theme (#0c0c0c) with warm gold accent (#c9a96e)
- Animation Easing: Custom cubic-bezier curves

## Performance Optimizations

- **Smooth scrolling** — Lenis with 0.8s duration (optimized for snappy feel)
- **Reduced scrub overhead** — Parallax animations use `scrub: 1` instead of `true`
- **Custom cursor** — Single RAF loop for better performance
- **Minified assets** — CSS (~28% smaller) and JS (~30% smaller)
- **WebP images** — Optimized image formats

## Deployment

The site is deployed on **Vercel** with:
- Automatic builds from main branch
- API routes support (Serverless Functions)
- Zero-config deployment

## License

© 2026 Chinmay Agrawal. All rights reserved.
