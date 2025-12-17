# Editorial Photographer Portfolio — Starter

This is a minimal premium editorial portfolio template built with HTML, CSS and a bit of vanilla JavaScript.

Features
- Modern editorial typographic system (Playfair Display + Inter)
- Responsive layout: hero, portfolio grid, about, services, contact
- Accessible lightbox with keyboard controls
- Mobile navigation toggle
- Clean CSS variables & components for easy customization

How to use
1. Download these files and place them in a folder structure:
   - index.html
   - css/styles.css
   - js/scripts.js
   - (optional) assets/ for your images
2. Replace the Unsplash placeholder image URLs in `index.html` (and CSS hero/about backgrounds) with your own high-resolution images.
3. Customize copy (name, bio, services) and contact email in the contact form.
4. Host on any static host (Netlify, Vercel, GitHub Pages).

Customization tips
- Swap fonts via Google Fonts in the head of `index.html`.
- Tweak colors and spacing using CSS variables at the top of `css/styles.css`.
- For production, consider inlining critical CSS and optimizing image sizes / adding srcset for responsive images.
- If you want filtering or categories in the gallery, add data attributes and simple JS filters.

Accessibility & SEO
- All images have `alt` attributes — update them for SEO.
- The lightbox uses ARIA attributes and keyboard handling for accessibility.
- Add your social profile URLs to `index.html` and expand the JSON-LD if desired.

License
- Use and modify freely for your portfolio. Replace placeholder assets with licensed assets for commercial use.
