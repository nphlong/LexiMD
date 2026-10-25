import { Scheme } from '../settings/settings';

export type Palette = {
  background: string;
  text: string;
  muted: string;
  line: string;
  danger: string;
  button: string;
  buttonText: string;
  chip: string;
  chipText: string;
};

const light: Palette = {
  background: '#ffffff',
  text: '#111111',
  muted: '#444444',
  line: '#dddddd',
  danger: '#8a1f1f',
  button: '#111111',
  buttonText: '#ffffff',
  chip: '#f2f2f2',
  chipText: '#111111',
};

const dark: Palette = {
  background: '#111111',
  text: '#f5f5f5',
  muted: '#c6c6c6',
  line: '#333333',
  danger: '#ffb4b4',
  button: '#f5f5f5',
  buttonText: '#111111',
  chip: '#2a2a2a',
  chipText: '#f5f5f5',
};

export function colorsFor(scheme: Scheme): Palette {
  return scheme === 'dark' ? dark : light;
}
