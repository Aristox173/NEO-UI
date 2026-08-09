/** How the icon value should be interpreted and rendered. */
export type ButtonIconType = 'font' | 'svg' | 'image';

/** Where the icon sits relative to the projected label content. */
export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Describes an icon to render inside a Button.
 *
 * - `font`: `value` is a CSS class list applied to an `<i>` element (e.g. Font Awesome, Material Icons).
 * - `svg`: `value` is raw inline SVG markup. The caller is responsible for the safety of this
 *   markup — it is rendered with Angular's `bypassSecurityTrustHtml`, so never pass untrusted input.
 * - `image`: `value` is a URL to a raster or vector image file (png, jpg, svg, ...), rendered as `<img>`.
 */
export interface ButtonIcon {
  type: ButtonIconType;
  value: string;
  /** Accessible text for `image` icons. Ignored for `font`/`svg`, which are treated as decorative. */
  alt?: string;
}
