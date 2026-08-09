import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  isDevMode,
  output,
  viewChild,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import type { ButtonIcon, ButtonIconPosition } from './neo-button-icon.model';
import type { ButtonSize, ButtonType, ButtonVariant } from './neo-button.types';

/** Shape of the context passed into the shared `#slot` template — one per icon position. */
interface IconSlotContext {
  icon: ButtonIcon | null;
  position: ButtonIconPosition;
  spinner: boolean;
}

@Component({
  selector: 'neo-button',
  imports: [NgTemplateOutlet],
  templateUrl: './neo-button.html',
  styleUrl: './neo-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');

  /** Visual style of the button. */
  readonly variant = input<ButtonVariant>('primary');
  /** Size of the button. */
  readonly size = input<ButtonSize>('md');
  /** Native `type` attribute. Ignored when `href` is set (renders as `<a>`). */
  readonly type = input<ButtonType>('button');
  /** Disables the button and blocks interaction. */
  readonly disabled = input(false);
  /** Shows a spinner in place of one icon slot and blocks interaction. */
  readonly loading = input(false);
  /** Text shown instead of the projected label while `loading` is true. */
  readonly loadingText = input<string | null>(null);
  /** Stretches the button to the full width of its container. */
  readonly fullWidth = input(false);
  /** Renders a square, icon-only button (hides the label). Requires `ariaLabel`. */
  readonly iconOnly = input(false);
  /** Accessible name. Required when `iconOnly` is true. */
  readonly ariaLabel = input<string | null>(null);
  /** Toggle-button state. Leave unset for a regular action button — `aria-pressed` is only rendered when this is `true`/`false`. */
  readonly pressed = input<boolean | null>(null);
  /**
   * Focuses the button once, right after it first renders. Implemented with `.focus()`
   * instead of the native `autofocus` attribute, which browsers largely ignore for
   * elements inserted after the initial page load (e.g. a button rendered inside a
   * Dialog opened via the CDK Overlay) — exactly the case this is meant for.
   */
  readonly autofocus = input(false);

  /** Icon rendered to the left of the label. Any combination of the four slots may be set at once. */
  readonly iconLeft = input<ButtonIcon | null>(null);
  /** Icon rendered to the right of the label. */
  readonly iconRight = input<ButtonIcon | null>(null);
  /** Icon rendered above the label. */
  readonly iconTop = input<ButtonIcon | null>(null);
  /** Icon rendered below the label. */
  readonly iconBottom = input<ButtonIcon | null>(null);

  /** Renders the control as an `<a>` instead of a `<button>`. */
  readonly href = input<string | null>(null);
  /** `target` attribute, only applied when `href` is set. */
  readonly target = input<string | null>(null);
  /** `rel` attribute override. Defaults to `noopener noreferrer` when `target` is `_blank`. */
  readonly rel = input<string | null>(null);

  /** Emits on click, unless the button is disabled or loading. */
  readonly clicked = output<MouseEvent>();

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) {
        this.trigger()?.nativeElement.focus();
      }

      if (isDevMode() && this.iconOnly() && !this.ariaLabel()) {
        console.warn(
          '[neo-button] iconOnly buttons have no visible label — set ariaLabel so assistive technology can announce what this button does.',
        );
      }
    });
  }

  protected readonly isAnchor = computed(() => this.href() !== null);

  protected readonly isInteractionDisabled = computed(() => this.disabled() || this.loading());

  /** Which icon slot shows the spinner while loading: the first populated slot, or `left` by default. */
  protected readonly spinnerSlot = computed<ButtonIconPosition>(() => {
    if (this.iconLeft()) return 'left';
    if (this.iconRight()) return 'right';
    if (this.iconTop()) return 'top';
    if (this.iconBottom()) return 'bottom';
    return 'left';
  });

  protected readonly ariaPressedValue = computed(() => {
    const pressed = this.pressed();
    return pressed === null ? null : String(pressed);
  });

  protected readonly computedRel = computed(() => {
    const rel = this.rel();
    if (rel !== null) return rel;
    return this.target() === '_blank' ? 'noopener noreferrer' : null;
  });

  /** Native tooltip fallback for icon-only buttons, mirroring the accessible name. */
  protected readonly autoTitle = computed(() => (this.iconOnly() ? this.ariaLabel() : null));

  protected readonly classes = computed(() => {
    return [
      'neo-button',
      `neo-button--${this.variant()}`,
      `neo-button--${this.size()}`,
      this.fullWidth() ? 'neo-button--full-width' : '',
      this.iconOnly() ? 'neo-button--icon-only' : '',
      this.loading() ? 'neo-button--loading' : '',
      this.isInteractionDisabled() ? 'neo-button--disabled' : '',
      this.pressed() === true ? 'neo-button--pressed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected sanitize(icon: ButtonIcon): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon.value);
  }

  /**
   * Decides what — if anything — a given icon position should render: the loading
   * spinner (when it's the active `spinnerSlot`), the configured icon, or nothing.
   * Centralized here so the four positions can never disagree on the priority
   * between "show the spinner" and "show the icon" — they all call this one function.
   */
  protected iconSlotContext(
    icon: ButtonIcon | null,
    position: ButtonIconPosition,
  ): IconSlotContext | null {
    if (this.loading() && this.spinnerSlot() === position) {
      return { icon: null, position, spinner: true };
    }
    if (icon) {
      return { icon, position, spinner: false };
    }
    return null;
  }

  protected onClick(event: MouseEvent): void {
    if (this.isInteractionDisabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
