import { act, fireEvent, render } from '@testing-library/react-native';

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  const WebView = (props: object) => React.createElement(View, props);
  return { __esModule: true, default: WebView, WebView };
});

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
}));

import App from './App';
import { copy, CORE_FUNCTION } from './src/copy';
import { vi } from './src/i18n/vi';
import { createMemoryNoteIo } from './src/notes/memoryNoteIo';
import { createNoteStore } from './src/notes/store';
import { createSettingsStore } from './src/settings/settingsStore';

const CORE_FUNCTION_SENTENCE =
  'Turn a rough note into clean markdown and see it rendered, diagrams included.';

async function renderApp() {
  const io = createMemoryNoteIo();
  const store = createNoteStore(io, {
    now: () => new Date('2026-10-25T08:00:00.000Z'),
    random: () => 0.5,
    untitled: () => 'Untitled',
  });
  const settings = createSettingsStore(createMemoryNoteIo());
  await settings.save({ appearance: 'light', language: 'en' });
  return { io, store, ...(await render(<App settingsStore={settings} store={store} />)) };
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

  test('finds a note by tag and ignores the body', async () => {
    const { findByText, getByPlaceholderText, getByText, queryByText } = await renderApp();

    await act(async () => {
      fireEvent.press(getByText(copy.newNote));
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.writeNote), '# Milk\nbread');
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.tagPlaceholder), 'shop');
    });
    await act(async () => {
      fireEvent.press(getByText(copy.addTag));
    });
    await act(async () => {
      fireEvent.press(getByText(copy.back));
    });

    await findByText('Milk');
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.search), 'shop');
    });
    await findByText('Milk');
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.search), 'bread');
    });
    expect(queryByText('Milk')).toBeNull();
    await findByText(copy.noMatches);
  });

  test('files a note in a folder and shows that folder', async () => {
    const { findByText, getByPlaceholderText, getByText } = await renderApp();

    await act(async () => {
      fireEvent.press(getByText(copy.newNote));
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.writeNote), '# Milk');
    });
    await act(async () => {
      fireEvent.press(getByText(copy.back));
    });
    await findByText('Milk');
    await act(async () => {
      fireEvent.press(getByText(copy.newFolder));
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText(copy.folderName), 'Shop');
    });
    await act(async () => {
      fireEvent.press(getByText(copy.addFolder));
    });
    await findByText(copy.emptyFolder);
    await act(async () => {
      fireEvent.press(getByText(copy.allNotes));
    });
    await act(async () => {
      fireEvent.press(getByText('Milk'));
    });
    await act(async () => {
      fireEvent.press(getByText('Shop'));
    });
    await act(async () => {
      fireEvent.press(getByText(copy.back));
    });
    await act(async () => {
      fireEvent.press(getByText('Shop'));
    });
    await findByText('Milk');
  });

  test('switches the library to Vietnamese', async () => {
    const { findByPlaceholderText, findByText, getByText } = await renderApp();

    await findByText(copy.settings);
    await act(async () => {
      fireEvent.press(getByText(copy.settings));
    });
    await act(async () => {
      fireEvent.press(getByText(copy.vietnamese));
    });

    await findByText(vi.newNote);
    await findByPlaceholderText(vi.search);
  });
});
