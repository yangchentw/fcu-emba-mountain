# Home Legacy Background Design

## Goal

Give the homepage 「傳承，向上」 section a photo background that communicates the association's collective continuity and makes the currently empty visual space purposeful.

## Selected Direction

Use `參考資料/照片/IMG_0830.JPG`, a group photograph at Hehuan North Peak with the association flag and summit marker. The image will become a full-width homepage background.

## Layout and Readability

- Apply the existing `story-photo` presentation to the legacy section, keeping the homepage's visual rhythm consistent.
- Use a dedicated `story-legacy` background rule with the processed image asset.
- Position the image so the group, summit marker, and association flag remain centered to right-weighted.
- Retain the existing left-side text panel with a deep-green, left-to-right gradient. The opaque portion guarantees white text remains readable and fades before the flag and central group.
- Preserve the current heading, description, and link destination.

## Image Handling

- Add `IMG_0830.JPG` to the committed image pipeline as `public/images/legacy-group.jpg`.
- Generate the website image with the existing image processing workflow, bounded to 2400 pixels on its long edge.

## Validation

- Add a regression check that the homepage legacy section uses `story-photo story-legacy` and that the image pipeline produces `legacy-group.jpg`.
- Confirm the production build references `/images/legacy-group.jpg`.
- Run the complete test suite and production build.
