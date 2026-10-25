import { act, fireEvent, render } from '@testing-library/react-native';

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  const WebView = (props: object) => React.createElement(View, props);
  return { __esModule: true, default: WebView, WebView };
});

import App from './App';
import { copy, CORE_FUNCTION } from './src/copy';
import { createMemoryNoteIo } from './src/notes/memoryNoteIo';
import { createNoteStore } from './src/notes/store';

const CORE_FUNCTION_SENTENCE =
  'Turn a rough note into clean markdown and see it rendered, diagrams included.';

async function renderApp() {
  const io = createMemoryNoteIo();
  const store = createNoteStore(io, {
    now: () => new Date('2026-10-25T08:00:00.000Z'),
    random: () => 0.5,
  });
  return { io, store, ...(await render(<App store={store} />)) };
}

describe('library', () => {
  test('shows the core-function sentence when there are no notes', async () => {
    const { findByText } = await renderApp();

    expect(CORE_FUNCTION).toBe(CORE_FUNCTION_SENTENCE);
    await findByText(copy.appName);
    await findByText(CORE_FUNCTION_SENTENCE);
  });

  test('creates a note, saves the markdown, and lists the title', async () => {
    const { io, findByText, getByPlaceholderText, getByText } = await renderApp();

    await findByText(copy.newNote);
    await act(async () => {
      fireEvent.press(getByText(copy.newNote));
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.writeNote), '# Milk\nbread');
    });
    await act(async () => {
      fireEvent.press(getByText(copy.back));
    });

    await findByText('Milk');
    const markdown = [...io.files.values()].find((text) => text.includes('# Milk'));
    expect(markdown).toBe('# Milk\nbread');
  });
});
