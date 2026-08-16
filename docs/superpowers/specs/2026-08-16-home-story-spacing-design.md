# Homepage Story Spacing Design

## Goal

Give each homepage photo story section more scroll distance, so visitors can take in more of its background image without compromising text contrast or responsive readability.

## Design

The existing shared `.story-photo` rule remains the single styling boundary for the forest, activities, and legacy sections. On desktop, increase its minimum height from `58vh` to `78vh`, and increase the content panel's vertical padding from `clamp(3rem, 9vw, 8rem)` to `clamp(5rem, 11vw, 11rem)`. On screens up to 760px wide, increase the photo-section minimum height from `48vh` to `62vh` and the content panel's vertical padding from `4rem` to `5rem`.

The background images, their attachment behavior, text gradient, CTA buttons, and non-photo information section remain unchanged.

## Verification

The homepage must retain three photo story sections, and the shared CSS must provide the specified desktop and mobile minimum heights and padding. A local browser check at desktop and mobile widths must show readable text, visible CTA buttons, and no clipping or console errors.
