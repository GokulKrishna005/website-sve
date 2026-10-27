# Sree Vijayalakshmi Enterprises

Responsive static website for event management and equipment rentals in Bengaluru and across South India. Plain HTML, CSS, and JavaScript; no build or installation required.

## Features

- Responsive navigation and mobile layout.
- Full-screen company logo opening with a subtle looping video on desktop and a lightweight pointer accent. Scrolling moves directly to the page content.
- Nine service cards linking to individual photo pages, an additional-requirements callout, and service-specific enquiry links.
- Filterable gallery with accessible photo dialogs.
- Company introduction, event planning process, and expandable FAQs.
- Enquiry form that prepares an email using the visitor's email app. No backend, stored enquiries, or automatic sending.
- Original SVG concept illustrations, labelled as illustrations until actual event photos are supplied.

## Update images

See [ADDING-IMAGES.md](ADDING-IMAGES.md). Homepage photo paths are in `assets/js/content.js`; service page photos and descriptions are in `tools/build-services.cjs`. Upload actual photographs to `assets/images/`, then regenerate the service pages with `node tools/build-services.cjs`.

## Preview

Open `index.html` in a browser, or serve the repository root using any static web server. Google Fonts are optional external resources; local fallback fonts are provided.

## Deploy to GitHub Pages

In repository **Settings > Pages**, choose **Deploy from a branch**, then **main** and **/(root)**, and click **Save**. Once enabled, future changes to main automatically publish. No custom workflow is needed.

Expected address after successful deployment: https://gokulkrishna005.github.io/website-sve/

The GitHub repository and a live website are separate. Check the Pages settings and deployment status before sharing the expected address.

## Content

Business facts and contact details come from the supplied introduction letter. The logo was restored from the supplied company images, preserving blue and grey colours and removing the letterhead contact details from the logo. Actual event photographs can be added using the image guide.

Repository: https://github.com/GokulKrishna005/website-sve
