# Add your logo and event photos

You can attach your photographs in the existing Codex chat and ask to add them to the website. Include a short caption and the category for each photo.

To update photos yourself on GitHub:

1. Open the `assets/images` folder in this repository.
2. Select **Add file > Upload files**. Upload JPG, PNG, or WebP photos you have permission to publish. Use simple names such as `wedding-tent.jpg`. Ideally compress photos to under 500 KB each.
3. Commit the upload.
4. Open `assets/js/content.js` and select the pencil icon to edit it.
5. Replace a gallery entry with the following, changing the name, path, and description:

```js
{ title: "Wedding tent setup", category: "Structures", src: "assets/images/wedding-tent.jpg", alt: "Describe what is visible in the actual photo", illustration: false }
```

Categories must be `Structures`, `Exhibitions`, or `Seating`. Separate entries with commas. The included illustrations can be retained or replaced. Set `illustration: false` for real photographs; do not label a stock photo as the company's work.

To replace the large hero image, change `hero: null` to:

```js
hero: {
  src: "assets/images/wedding-tent.jpg",
  alt: "Describe the event photo",
  caption: "Your event or setup caption"
},
```

Keep the rest of `window.SVE_CONTENT` intact. After committing, GitHub Pages republishes automatically once branch deployment is enabled.

## Service photos

Each card in **Our Services** has its own photo slot. The current cards use photographs from the company collection in `assets/images/work/`. To replace one, upload a new image to that directory and edit `servicePhotos` in `assets/js/content.js`.

Replace a `null` entry with a path and description, for example:

```js
"german-tents": { src: "assets/images/german-tent.jpg", alt: "German tent setup at our event" }
```

The service keys are `german-tents`, `pagoda-tents`, `octonorm-stalls`, `jewellery-showcases`, `stages-platforms`, `furniture`, `branding`, `carpeting`, and `sound-lighting`. Landscape photos work best. Missing or invalid images keep the placeholder visible. The extended use-case text is in `index.html` and appears on hover, keyboard focus, and touch screens.

The opening background is `assets/video/sve-work-loop.webm`, a 12-second sequence made from three supplied company-work photos. Its still fallback is `assets/images/work/clear-canopy-wedding-entrance-01.jpeg`. The video is muted, loops, and pauses offscreen. It starts after the logo finishes building so the two effects do not compete. Mobile screens, reduced-motion preferences, and data-saving preferences use the still image. Desktop visitors can pause or resume the video with the button on the opening screen; that choice is remembered in their browser. Its behavior is in `assets/js/experience.js` and its styles in `assets/css/experience.css`.

## Service detail pages

The nine pages in `services/` show more company photos and a short service description. Their content is maintained in `tools/build-services.cjs`; photo captions are in `tools/photo-captions.json`. To add a photo, upload it to the appropriate folder under `assets/images/services/`, add its filename to the relevant `photos` list in `tools/build-services.cjs`, then run `node tools/build-services.cjs` and commit the resulting page. Existing homepage photos in `assets/images/work/` are reused automatically when the filename matches. Keep captions factual and use photos from the matching service.

## Logo asset

The opening uses an inline blue SVG mark in `index.html` for the ribbon-drawing animation, with an animated company name. Navigation and footer use `assets/images/sve-mark.svg`; the browser tab uses `assets/images/favicon.svg`. The restored reference image remains in `assets/images/sve-logo-enhanced.png`. Keep the blue and grey brand colours when updating these assets. Contact details stay in the contact section.

The theme button follows the visitor's system preference until they choose light or dark, then remembers that choice in their browser. Theme and opening-animation styles are in `assets/css/theme-animation.css`. Reduced-motion preferences disable the entrance animation.

## Interactive tent previews

The German and Pagoda previews are illustrative, code-generated 3D meshes, not measured replicas. Their geometry and controls live in `assets/js/tents.js`, with styles in `assets/css/tents.css`. They require no Blender installation, external models, or CDN libraries. Rendering happens only when the view changes. Rotate by dragging, reposition using Move mode, and zoom with the buttons or a two-finger pinch. Keyboard users can use arrows, +/−, Home, and Shift + arrows. Roof colour and side-wall options are concepts, not confirmed stock configurations.

To refine the models, supply front, side, and interior photos plus actual width, length, eave height, and peak height. Service photographs remain separate from the 3D viewers.

## Paper theme and cursor interaction

`assets/css/paper-theme.css` defines the blue paper palette for both themes, textured surfaces, and section edges. `assets/js/paper-motion.js` paints faceted paper folds near the pointer on the logo screen, inspired by [PaperDrops](https://tympanus.net/Demos/PaperDrops/). The effect uses a small canvas around the pointer rather than repainting the entire screen. The logo remains an accessible link. The folds are disabled for touch pointers and reduced-motion preferences.

## Contact details

Contact details and text are in `index.html`. If changing the enquiry email or phone number, also update their occurrences in `assets/js/main.js`. The form opens the visitor's email app and does not store or send data on its own.
