import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { CategoryFilter } from './category-filter';

describe('<CategoryFilter />', () => {
  it('shows an "All" button followed by every category in display order', async () => {
    await render(<CategoryFilter value="all" onChange={jest.fn()} />);

    const labels = screen
      .getAllByRole('button')
      .map((button) => within(button).getByText(/.+/).props.children);
    expect(labels).toEqual(['All', 'Mains', 'Snacks', 'Drinks', 'Desserts']);
  });

  it('disables the selected option only', async () => {
    await render(<CategoryFilter value="drink" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Drinks' })).toBeDisabled();
    for (const name of ['All', 'Mains', 'Snacks', 'Desserts']) {
      expect(screen.getByRole('button', { name })).toBeEnabled();
    }
  });

  it('calls onChange with the pressed category', async () => {
    const onChange = jest.fn();
    await render(<CategoryFilter value="all" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Snacks' }));

    expect(onChange).toHaveBeenCalledWith('snack');
  });

  it('calls onChange with "all" when "All" is pressed', async () => {
    const onChange = jest.fn();
    await render(<CategoryFilter value="main" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', { name: 'All' }));

    expect(onChange).toHaveBeenCalledWith('all');
  });
});
