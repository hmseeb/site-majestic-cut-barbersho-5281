# Majestic Cut Barbershop — New York

Single-page site for Majestic Cut Barbershop (New York, NY). Vanilla HTML, CSS
and JavaScript — no build step. Open `index.html` or serve the folder statically.

## Files
- `index.html` — the whole page (hero, services, how it works, contact + booking form)
- `styles.css` — design system and responsive layout
- `script.js` — progressive enhancement for the booking form (works without JS)
- `favicon.svg` — barber-pole favicon

## Booking form
Posts to LeadrVision. A plain submission returns to the page with `?submitted=1`
and the confirmation is shown; with JS it posts the same data as JSON to the same
URL and confirms inline.

## Review link
"Leave us a review" points at `/review`, which is provided by the hosting platform.
