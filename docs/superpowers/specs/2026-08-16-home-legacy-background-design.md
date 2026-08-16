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

## Homepage Navigation Buttons

- Convert every homepage content-section internal navigation link into the existing `CtaLink` button component: 「認識峰鷹 →」、「探索活動與社群 →」與「查看組織與傳承 →」.
- Keep the existing gold button background, rounded shape, dark text, and visible keyboard focus treatment provided by `.cta`.
- Keep the arrow in each label and retain the existing internal destinations: `/about/`, `/activities/`, and `/legacy/`.
- Do not change the homepage hero's external recruitment button or the Association Information section, which has no navigation link.

## Image Handling

- Add `IMG_0830.JPG` to the committed image pipeline as `public/images/legacy-group.jpg`.
- Generate the website image with the existing image processing workflow, bounded to 2400 pixels on its long edge.

## Validation

- Add a regression check that the homepage legacy section uses `story-photo story-legacy` and that the image pipeline produces `legacy-group.jpg`.
- Add a regression check that the three content-section navigation links use `CtaLink` with their existing labels and destinations.
- Confirm the production build references `/images/legacy-group.jpg`.
- Run the complete test suite and production build.
