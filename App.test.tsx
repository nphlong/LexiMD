import { render } from '@testing-library/react-native';

import App, { CORE_FUNCTION } from './App';

const CORE_FUNCTION_SENTENCE =
  'Turn a rough note into clean markdown and see it rendered, diagrams included.';

describe('hello screen', () => {
  test('shows the core-function sentence', async () => {
    const { getByText } = await render(<App />);

    expect(CORE_FUNCTION).toBe(CORE_FUNCTION_SENTENCE);
    getByText('LexiMD');
    getByText(CORE_FUNCTION_SENTENCE);
  });
});
