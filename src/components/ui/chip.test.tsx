import { fireEvent, render, screen } from '@testing-library/react-native';

import { Chip } from './chip';

const mockColorScheme = jest.fn<'light' | 'dark', []>(() => 'light');

// The theme reads the system colour scheme through React Native's useColorScheme.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

describe('<Chip />', () => {
  beforeEach(() => mockColorScheme.mockReturnValue('light'));

  it('renders the label as an accessible button', async () => {
    await render(<Chip label="Drinks" selected={false} onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Drinks' })).toHaveTextContent('Drinks');
  });

  it('reports the selected state to accessibility tools', async () => {
    await render(<Chip label="Drinks" selected onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Drinks' })).toBeSelected();
  });

  it('reports not selected when unselected', async () => {
    await render(<Chip label="Drinks" selected={false} onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Drinks' })).not.toBeSelected();
  });

  it('calls onPress when pressed, whether selected or not', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Chip label="Drinks" selected={false} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Drinks' }));
    await rerender(<Chip label="Drinks" selected onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Drinks' }));

    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('is filled dark with light text when selected', async () => {
    await render(<Chip label="Drinks" selected onPress={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveStyle({
      backgroundColor: '#18181b',
      borderColor: '#18181b',
    });
    expect(screen.getByText('Drinks')).toHaveStyle({ color: '#fafafa' });
  });

  it('is outlined with dark text when not selected', async () => {
    await render(<Chip label="Drinks" selected={false} onPress={jest.fn()} />);

    const chip = screen.getByRole('button');
    expect(chip).toHaveStyle({ borderColor: '#d4d4d8' });
    expect(chip).not.toHaveStyle({ backgroundColor: '#18181b' });
    expect(screen.getByText('Drinks')).toHaveStyle({ color: '#171717' });
  });

  it('inverts the selected colours in dark mode', async () => {
    mockColorScheme.mockReturnValue('dark');
    await render(<Chip label="Drinks" selected onPress={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#fafafa' });
    expect(screen.getByText('Drinks')).toHaveStyle({ color: '#18181b' });
  });

  it('is fully rounded (pill shape)', async () => {
    await render(<Chip label="Drinks" selected={false} onPress={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveStyle({ borderRadius: 999 });
  });
});
