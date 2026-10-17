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

Each card in **Our Services** has its own photo slot. Send photos in the Codex chat with the service name, or upload them to `assets/images/` and edit `servicePhotos` in `assets/js/content.js`.

Replace a `null` entry with a path and description, for example:

```js
"german-tents": { src: "assets/images/german-tent.jpg", alt: "German tent setup at our event" }
```

The service keys are `german-tents`, `pagoda-tents`, `octonorm-stalls`, `jewellery-showcases`, `stages-platforms`, `furniture`, `branding`, `carpeting`, and `sound-lighting`. Landscape photos work best. Until a photo is supplied, the card displays **Photos coming soon**. Missing or invalid images keep the placeholder visible.

## Logo asset

The opening, navigation, and footer use `assets/images/sve-logo-enhanced.png`, restored from the supplied company logo and letterhead. The opening logo omits the address, telephone numbers, and email; those remain in the contact section. Keep the blue and grey brand colours when replacing this asset.

## Contact details

Contact details and text are in `index.html`. If changing the enquiry email or phone number, also update their occurrences in `assets/js/main.js`. The form opens the visitor's email app and does not store or send data on its own.
