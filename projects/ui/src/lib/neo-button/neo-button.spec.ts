import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Button } from './neo-button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native button', () => {
    expect(nativeButton()).toBeTruthy();
  });

  it('applies variant and size modifier classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const classList = nativeButton().className;
    expect(classList).toContain('neo-button--secondary');
    expect(classList).toContain('neo-button--lg');
  });

  it('reflects the disabled input on the native element', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeButton().disabled).toBe(true);
  });

  it('disables the native element while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(nativeButton().disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('.neo-button__spinner')).toBeTruthy();
  });

  it('sets aria-busy only while loading', () => {
    expect(nativeButton().getAttribute('aria-busy')).toBeNull();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(nativeButton().getAttribute('aria-busy')).toBe('true');
  });

  it('emits clicked when enabled', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    nativeButton().click();
    expect(spy).toHaveBeenCalled();
  });

  it('does not emit clicked when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    nativeButton().click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('applies the extra sizes', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();
    expect(nativeButton().className).toContain('neo-button--xs');

    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    expect(nativeButton().className).toContain('neo-button--xl');
  });

  it('renders a font icon as an <i> with the given classes', () => {
    fixture.componentRef.setInput('iconLeft', { type: 'font', value: 'my-icon-class' });
    fixture.detectChanges();
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.neo-button__icon--left i');
    expect(iconEl.className).toBe('my-icon-class');
  });

  it('renders an image icon as an <img>', () => {
    fixture.componentRef.setInput('iconLeft', { type: 'image', value: '/check.png', alt: 'Check' });
    fixture.detectChanges();
    const imgEl: HTMLImageElement = fixture.nativeElement.querySelector(
      '.neo-button__icon--left img',
    );
    expect(imgEl.src).toContain('/check.png');
    expect(imgEl.alt).toBe('Check');
  });

  it('renders sanitized inline markup for svg icons', () => {
    fixture.componentRef.setInput('iconLeft', {
      type: 'svg',
      value: '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"></circle></svg>',
    });
    fixture.detectChanges();
    const svgEl = fixture.nativeElement.querySelector('.neo-button__svg svg');
    expect(svgEl).toBeTruthy();
  });

  it('renders any combination of the four icon slots at once', () => {
    const icon = { type: 'font' as const, value: 'x' };
    fixture.componentRef.setInput('iconLeft', icon);
    fixture.componentRef.setInput('iconRight', icon);
    fixture.componentRef.setInput('iconTop', icon);
    fixture.componentRef.setInput('iconBottom', icon);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--left')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--right')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--top')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--bottom')).toBeTruthy();
  });

  it('does not render slots for icons that were never set', () => {
    fixture.componentRef.setInput('iconTop', { type: 'font', value: 'x' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--top')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--left')).toBeNull();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--right')).toBeNull();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--bottom')).toBeNull();
  });

  it('shows the loading spinner in the first populated icon slot', () => {
    fixture.componentRef.setInput('iconRight', { type: 'font', value: 'x' });
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.neo-button__icon--right .neo-button__spinner'),
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.neo-button__icon--left')).toBeNull();
  });

  it('defaults the loading spinner to the left slot when no icon is set', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.neo-button__icon--left .neo-button__spinner'),
    ).toBeTruthy();
  });

  it('warns in dev mode when iconOnly has no ariaLabel', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const localFixture = TestBed.createComponent(Button);
    localFixture.componentRef.setInput('iconOnly', true);
    localFixture.detectChanges();
    await localFixture.whenStable();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('iconOnly'));
    warnSpy.mockRestore();
  });

  it('hides the label when iconOnly is set', () => {
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.neo-button__label')).toBeNull();
  });

  it('shows loadingText instead of the label while loading', () => {
    fixture.componentRef.setInput('loadingText', 'Saving…');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.neo-button__label').textContent.trim()).toBe(
      'Saving…',
    );
  });

  it('only renders aria-pressed when pressed is explicitly set', () => {
    expect(nativeButton().hasAttribute('aria-pressed')).toBe(false);
    fixture.componentRef.setInput('pressed', true);
    fixture.detectChanges();
    expect(nativeButton().getAttribute('aria-pressed')).toBe('true');
  });

  it('focuses the trigger on first render when autofocus is set', async () => {
    const localFixture = TestBed.createComponent(Button);
    localFixture.componentRef.setInput('autofocus', true);
    localFixture.detectChanges();
    await localFixture.whenStable();
    expect(document.activeElement).toBe(localFixture.nativeElement.querySelector('button'));
  });

  it('sets a native title from ariaLabel when iconOnly', () => {
    fixture.componentRef.setInput('iconOnly', true);
    fixture.componentRef.setInput('ariaLabel', 'Confirm');
    fixture.detectChanges();
    expect(nativeButton().title).toBe('Confirm');
  });

  describe('anchor mode (href set)', () => {
    function nativeAnchor(): HTMLAnchorElement {
      return fixture.nativeElement.querySelector('a');
    }

    it('renders an <a> instead of a <button> when href is set', () => {
      fixture.componentRef.setInput('href', '/docs');
      fixture.detectChanges();
      expect(nativeAnchor()).toBeTruthy();
      expect(fixture.nativeElement.querySelector('button')).toBeNull();
    });

    it('sets target and a safe rel by default when target is _blank', () => {
      fixture.componentRef.setInput('href', '/docs');
      fixture.componentRef.setInput('target', '_blank');
      fixture.detectChanges();
      expect(nativeAnchor().target).toBe('_blank');
      expect(nativeAnchor().rel).toBe('noopener noreferrer');
    });

    it('uses an explicit rel instead of the noopener default', () => {
      fixture.componentRef.setInput('href', '/docs');
      fixture.componentRef.setInput('target', '_blank');
      fixture.componentRef.setInput('rel', 'author');
      fixture.detectChanges();
      expect(nativeAnchor().rel).toBe('author');
    });

    it('emits clicked when the anchor is enabled', () => {
      fixture.componentRef.setInput('href', '/docs');
      fixture.detectChanges();
      const spy = vi.fn();
      component.clicked.subscribe(spy);
      nativeAnchor().click();
      expect(spy).toHaveBeenCalled();
    });

    it('strips href and marks aria-disabled instead of emitting when disabled', () => {
      fixture.componentRef.setInput('href', '/docs');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const anchor = nativeAnchor();
      expect(anchor.hasAttribute('href')).toBe(false);
      expect(anchor.getAttribute('aria-disabled')).toBe('true');
      expect(anchor.getAttribute('tabindex')).toBe('-1');

      const spy = vi.fn();
      component.clicked.subscribe(spy);
      anchor.click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('switches from <button> to <a> when href is set after creation', () => {
      expect(nativeButton()).toBeTruthy();
      expect(nativeAnchor()).toBeNull();

      fixture.componentRef.setInput('href', '/docs');
      fixture.detectChanges();

      expect(nativeAnchor()).toBeTruthy();
      expect(nativeButton()).toBeNull();
    });
  });
});
