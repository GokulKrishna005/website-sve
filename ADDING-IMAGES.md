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

## Logo

The current header uses a text wordmark. Send the original logo as a transparent PNG or SVG in the Codex chat to replace it cleanly. The current wordmark is not a recreation of the logo in the introduction letter.

## Contact details

Contact details and text are in `index.html`. If changing the enquiry email or phone number, also update their occurrences in `assets/js/main.js`. The form opens the visitor's email app and does not store or send data on its own.
