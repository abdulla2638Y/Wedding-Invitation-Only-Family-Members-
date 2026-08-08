# Mobile Wedding Invitation

## Folder structure
- index.html
- css/style.css
- js/config.js
- js/script.js
- assets/images/
- assets/music/

## How to customize

1. Open `js/config.js`.
2. Change the bride/groom names, date, venue, WhatsApp number and events.
3. Put your real photos in `assets/images/`.
4. Change the image paths in `config.js`.
5. Put your MP3 file at:
   `assets/music/wedding-music.mp3`
6. Open `index.html` in a browser.

## Important
For the WhatsApp button, use the full international number without `+` or spaces.
Example: India number 9876543210 becomes `919876543210`.

## Put your photos
Recommended:
- bride.jpg
- groom.jpg
- gallery-1.jpg ... gallery-5.jpg

Then change the paths in `config.js`, for example:
`photo: "assets/images/bride.jpg"`

## Online hosting
You can upload the whole folder to GitHub Pages, Netlify, Vercel or another static hosting service.
