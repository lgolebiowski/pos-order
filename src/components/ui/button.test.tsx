import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './button';

const mockColorScheme = jest.fn<'light' | 'dark', []>(() => 'light');

// The theme reads the system colour scheme through React Native's useColorScheme.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

describe('<Button />', () => {
  beforeEach(() => mockColorScheme.mockReturnValue('light'));

  it('renders the title as an accessible button', async () => {
    await render(<Button title="Save" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent('Save');
  });

  it('uses accessibilityLabel as the accessible name when given', async () => {
    await render(<Button title="+" accessibilityLabel="Add Apple" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Add Apple' })).toHaveTextContent('+');
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button title="Save" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled, dimmed, and ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="Save" disabled onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Save' });

    await fireEvent.press(button);

    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: 0.4 });
    expect(onPress).not.toHaveBeenCalled();
  });

  describe('variants (light theme)', () => {
    it('primary is filled dark with light text', async () => {
      await render(<Button title="Save" variant="primary" />);

      expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#18181b' });
      expect(screen.getByText('Save')).toHaveStyle({ color: '#fafafa' });
    });

    it('secondary (the default) is outlined with dark text', async () => {
      await render(<Button title="Save" />);

      expect(screen.getByRole('button')).toHaveStyle({
        backgroundColor: 'transparent',
        borderColor: '#d4d4d8',
      });
      expect(screen.getByText('Save')).toHaveStyle({ color: '#171717' });
    });

    it('ghost has no fill and no visible border', async () => {
      await render(<Button title="Clear" variant="ghost" />);

      expect(screen.getByRole('button')).toHaveStyle({
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });
    });
  });

  it('inverts the primary colours in dark mode', async () => {
    mockColorScheme.mockReturnValue('dark');
    await render(<Button title="Save" variant="primary" />);

    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#fafafa' });
    expect(screen.getByText('Save')).toHaveStyle({ color: '#18181b' });
  });

  it('meets the 44pt minimum touch target at the default size', async () => {
    await render(<Button title="Save" />);

    expect(screen.getByRole('button')).toHaveStyle({ minHeight: 44 });
  });

  it('uses a smaller target and label at size "sm"', async () => {
    await render(<Button title="Add" size="sm" />);

    expect(screen.getByRole('button')).toHaveStyle({ minHeight: 36 });
    expect(screen.getByText('Add')).toHaveStyle({ fontSize: 14 });
  });

  it('stretches to the container width when fullWidth', async () => {
    await render(<Button title="Submit" fullWidth />);

    expect(screen.getByRole('button')).toHaveStyle({ alignSelf: 'stretch' });
  });
});
