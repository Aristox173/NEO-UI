import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './neo-button';

const star = { type: 'font' as const, value: 'demo-icon-star' };
const heart = { type: 'font' as const, value: 'demo-icon-heart' };
const check = { type: 'font' as const, value: 'demo-icon-check' };
const settings = { type: 'font' as const, value: 'demo-icon-settings' };
const arrowLeft = { type: 'font' as const, value: 'demo-icon-arrow-left' };
const arrowRight = { type: 'font' as const, value: 'demo-icon-arrow-right' };
const arrowUp = { type: 'font' as const, value: 'demo-icon-arrow-up' };
const arrowDown = { type: 'font' as const, value: 'demo-icon-arrow-down' };

const checkSvg =
  '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4L8.6 12l6.7-6.7a1 1 0 0 1 1.4 0Z"/></svg>';

/**
 * Storybook-only demo icon font. Illustrates the `type: 'font'` icon contract
 * (a CSS class applied to an <i>) without a real icon-font dependency. Inlined
 * as a `<style>` tag directly in story templates — rather than an imported .css
 * file — because Storybook's Angular/Webpack preset has no loader configured
 * for plain side-effect CSS imports from a .stories.ts file. Swap for Font
 * Awesome, Material Icons, etc. in a real app.
 */
const DEMO_ICON_STYLES = `
  <style>
    [class^='demo-icon-']::before { font-style: normal; }
    .demo-icon-star::before { content: '★'; }
    .demo-icon-heart::before { content: '♥'; }
    .demo-icon-check::before { content: '✓'; }
    .demo-icon-settings::before { content: '⚙'; }
    .demo-icon-arrow-left::before { content: '←'; }
    .demo-icon-arrow-right::before { content: '→'; }
    .demo-icon-arrow-up::before { content: '↑'; }
    .demo-icon-arrow-down::before { content: '↓'; }
  </style>
`;

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    iconLeft: { control: 'object' },
    iconRight: { control: 'object' },
    iconTop: { control: 'object' },
    iconBottom: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<neo-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth">Primary action</neo-button>`,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px;">
        <neo-button variant="primary">Primary action</neo-button>
        <neo-button variant="secondary">Secondary</neo-button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <neo-button size="xs">Extra small</neo-button>
        <neo-button size="sm">Small</neo-button>
        <neo-button size="md">Medium</neo-button>
        <neo-button size="lg">Large</neo-button>
        <neo-button size="xl">Extra large</neo-button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px;">
        <neo-button variant="primary" [disabled]="true">Primary action</neo-button>
        <neo-button variant="secondary" [disabled]="true">Secondary</neo-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px;">
        <neo-button variant="primary" [loading]="true">Saving…</neo-button>
        <neo-button variant="secondary" [loading]="true">Saving…</neo-button>
      </div>
    `,
  }),
};

export const LoadingText: Story = {
  render: () => ({
    template: `<neo-button variant="primary" [loading]="true" loadingText="Saving…">Save</neo-button>`,
  }),
};

export const WithIconFont: Story = {
  name: 'With a font icon (<i>)',
  render: () => ({
    props: { star },
    template: `${DEMO_ICON_STYLES}<neo-button [iconLeft]="star">Favorite</neo-button>`,
  }),
};

export const WithIconSvg: Story = {
  render: () => ({
    props: { icon: { type: 'svg', value: checkSvg } },
    template: `<neo-button [iconLeft]="icon">Confirm</neo-button>`,
  }),
};

export const IconPositions: Story = {
  render: () => ({
    props: { check },
    template: `
      ${DEMO_ICON_STYLES}
      <div style="display: flex; gap: 12px;">
        <neo-button [iconLeft]="check">Left</neo-button>
        <neo-button [iconRight]="check">Right</neo-button>
        <neo-button [iconTop]="check">Top</neo-button>
        <neo-button [iconBottom]="check">Bottom</neo-button>
      </div>
    `,
  }),
};

export const AllFourIconsAtOnce: Story = {
  name: 'All four icon slots at once',
  render: () => ({
    props: { arrowLeft, arrowRight, arrowUp, arrowDown },
    template: `
      ${DEMO_ICON_STYLES}
      <neo-button
        variant="secondary"
        size="lg"
        [iconLeft]="arrowLeft"
        [iconRight]="arrowRight"
        [iconTop]="arrowUp"
        [iconBottom]="arrowDown"
      >
        Pan
      </neo-button>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    props: { heart },
    template: `${DEMO_ICON_STYLES}<neo-button [iconLeft]="heart" [iconOnly]="true" ariaLabel="Add to favorites"></neo-button>`,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `
      <div style="width: 320px; border: 1px dashed #d1d5db; padding: 12px;">
        <neo-button [fullWidth]="true">Full width</neo-button>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As a link (href)',
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px;">
        <neo-button href="https://storybook.js.org" target="_blank">Open docs</neo-button>
        <neo-button href="https://storybook.js.org" [disabled]="true">Disabled link</neo-button>
      </div>
    `,
  }),
};

export const ToggleButton: Story = {
  render: () => ({
    props: { settings },
    template: `
      ${DEMO_ICON_STYLES}
      <div style="display: flex; gap: 12px;">
        <neo-button variant="secondary" [iconLeft]="settings" [pressed]="false">Settings</neo-button>
        <neo-button variant="secondary" [iconLeft]="settings" [pressed]="true">Settings (pressed)</neo-button>
      </div>
    `,
  }),
};
