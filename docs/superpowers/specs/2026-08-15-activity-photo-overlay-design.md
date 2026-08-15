# Activity Photo Overlay Design

## Goal

Replace the cropped activity-page banner with a full-height visual that preserves the complete snowman and association cup while presenting the activity introduction directly on the image.

## Selected Direction

Use a photo-led activity hero with the complete portrait image centered in a dark green canvas. A left-to-right deep-green gradient provides a consistently legible content area on the left without obscuring the snowman and cup on the right.

## Layout

- The activity-page image becomes a dedicated hero section rather than a standalone cropped `<img>`.
- The portrait image is rendered with `contain`, never `cover`, so the full photo remains visible at every viewport size.
- The hero canvas uses the association's dark green as its base color, filling the side space left by the portrait ratio.
- A dark green, left-to-right gradient overlays the canvas. The left side is opaque enough for white text; it fades before the cup and snowman.
- The existing activity eyebrow, heading, description, and Facebook call to action appear in the left content area.

## Responsive Behavior

- Desktop: text occupies the left side; the complete photo stays centered to right-weighted.
- Mobile: text remains on a darkened lower portion of the hero while the image remains fully visible above and behind it.
- The image's accessible alternative text remains available, and the decorative background is not announced separately.

## Validation

- Add a regression test verifying that the activity page uses the dedicated uncropped hero treatment.
- Confirm the generated page contains the activity heading and call to action within the hero.
- Run the full test suite and production build.
